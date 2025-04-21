from flask import Blueprint, request, jsonify, current_app
project_recomm = Blueprint("project_recomm", __name__)
from bson.objectid import ObjectId
import requests
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup  # Import BeautifulSoup for parsing HTML
from .chatbot import chat
# Function to fetch GitHub repositories based on a topic/keyword
def search_github_projects(keyword, sort='stars', order='desc', per_page=8):
    url = "https://api.github.com/search/repositories"
    params = {
        "q": keyword,
        "sort": sort,
        "order": order,
        "per_page": per_page
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return [{
            # "name": repo["name"],
            # "owner": repo["owner"]["login"],
            "stars": repo["stargazers_count"],
            # "description": repo.get("description", "No description available"),
            "url": repo["html_url"],
            "domain": keyword
        } for repo in response.json().get("items", [])]
    else:
        print(f"Error fetching data: {response.status_code}")
        return []

# Function to fetch the README content asynchronously
def fetch_readme_content(repo_url):
    readme_url = f"{repo_url}/blob/main/README.md"
    try:
        response = requests.get(readme_url)
        if response.status_code == 200:
            # Parse the HTML content to extract text using BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')
            readme_text = soup.get_text()  # Extract text from the HTML
            return readme_text.strip()  # Remove leading/trailing whitespace
        else:
            return 'Error fetching README'
    except Exception as e:
        return f'Error fetching README: {e}'

# Function to recommend projects based on multiple keywords
def recommend_projects(keywords, per_page=5):
    all_recommendations = []
    for keyword in keywords:
        print(f"Searching for projects related to: {keyword}")
        all_recommendations.extend(search_github_projects(keyword, per_page=per_page))
    return all_recommendations

def truncate_string_column(df, column_name, max_length=1000):
    df[column_name] = df[column_name].str.slice(0, max_length)
    return df



@project_recomm.route("/", methods=["POST"])
def get_projects():
    # Extracting the keywords
    user_id = request.get_json().get("user_id")
    user = current_app.db["users"].find_one({'_id': ObjectId(user_id)})
    # print(user["skills"])
    keywords = user["skills"]#request.get_json().get("keywords")
    fp = ""
    for skill in keywords:
        print(skill)
        fp += skill["name"]
    df = pd.read_csv(f"package/project-data/{fp}.csv")
    # print("File path: ", fp)
    # Sample 5 random rows from the dataframe
    sampled_rows = df.sample(n= min(5, len(df)))  # Get 5 random rows from the DataFrame

    # Function to get the project idea (accepting a positional index argument)
    def fetch_project_idea(positional_index):
        # Get the 'readme' and 'domain' from the row
        readme = sampled_rows.iloc[positional_index]["readme"]
        domain = sampled_rows.iloc[positional_index]["domain"]  # Extract the domain for the current row
        
        # Parse the domain string to a Python dictionary
        domain = domain.replace("'", '"')  # Ensure the string is valid JSON (replace single quotes with double quotes)
        domain = domain.replace('ObjectId', '')  # Remove ObjectId
        domain = domain.replace('(', '').replace(')', '')  # Clean up any remaining parentheses
        
        # Safely evaluate the string into a Python dictionary
        # domain_dict = ast.literal_eval(domain)
        # print("Dmain is",domain)
        # Extract only the 'name' from the domain, assuming 'name' holds the title you need
        # domain_title = domain_dict.get('name', None)

        # Fetch response from the chat function
        response = chat(readme)
        
        # Return the final dictionary including the parsed domain title
        return {
            "title": response["title"],
            "description": response["description"],
            "key_features": response["key_features"],
            "domain": domain  # Include only the 'name' from the domain
        }

    # Using ThreadPoolExecutor to fetch 5 responses in parallel
    with ThreadPoolExecutor(max_workers=5) as executor:
        # Using range(len(sampled_rows)) to iterate over positional indices (0, 1, 2, 3, 4)
        responses = list(executor.map(fetch_project_idea, range(len(sampled_rows))))

    return jsonify({
        "responses": responses,  # List of 5 responses with their domains included
    })


@project_recomm.route("/load-projects", methods=["POST"])
def load_df():
    # Example usage
    user_id = request.get_json().get("user_id")
    user = current_app.db["users"].find_one({'_id': ObjectId(user_id)})
    keywords = user["skills"]#request.get_json().get("keywords")
    # keywords = ['Web Development', 'Machine Learning', 'AI', 'Data Science']
    fp =""
    new_keywords = []
    for skill in keywords:
        fp += skill["name"]
        new_keywords.append(skill["name"])
    print("New Skills are: ",new_keywords)
    
    # Get recommendations
    p = 10 if len(keywords) < 3 else 5
    recommended_projects = recommend_projects(new_keywords, per_page=p)

    # Prepare DataFrame with parallel fetching of README files
    # columns = ['name', 'domain', 'owner', 'stars', 'description', 'url', 'readme']
    columns = ['domain',  'url', 'readme', 'stars']
    df = pd.DataFrame(columns=columns)

    # Use ThreadPoolExecutor for parallelizing the README fetching
    with ThreadPoolExecutor(max_workers=5) as executor:
        readme_contents = list(executor.map(fetch_readme_content, [project['url'] for project in recommended_projects]))

    # Populate the DataFrame
    df['readme'] = readme_contents
    for i, project in enumerate(recommended_projects):
        df.loc[i] = {**project, 'readme': readme_contents[i]}

    # Display the DataFrame
    print("\nDataFrame with README content:")
    df = df[df["readme"]!="Error fetching README"]
    df = truncate_string_column(df, 'readme')
    df.to_csv(f"package/project-data/{fp}.csv")
    return jsonify("File Successfully saved"), 200