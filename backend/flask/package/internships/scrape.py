import requests
from bs4 import BeautifulSoup

def scrape_internships():
    url = "https://internshala.com/internships/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return []

    soup = BeautifulSoup(response.text, "html.parser")

    # Find internship cards
    internship_cards = soup.find_all("div", class_="individual_internship_details")

    internship_details = []

    for card in internship_cards:
        try:
            title_tag = card.find_previous("a", class_="job-title-href")
            title = title_tag.get_text(strip=True) if title_tag else "N/A"
            link = "https://internshala.com" + title_tag["href"] if title_tag else "No link"

            company_tag = card.find_previous("p", class_="company-name")
            company = company_tag.get_text(strip=True) if company_tag else "N/A"

            row_items = card.find("div", class_="detail-row-1").find_all("div", class_="row-1-item")
            
            location = row_items[0].find("a").get_text(strip=True) if row_items[0].find("a") else "Online"
            duration = row_items[1].find("span").get_text(strip=True) if len(row_items) > 1 else "N/A"
            stipend = row_items[2].find("span").get_text(strip=True) if len(row_items) > 2 else "N/A"

            posted_time_tag = card.find("div", class_="status-inactive")
            posted_time = posted_time_tag.find("span").get_text(strip=True) if posted_time_tag else "N/A"

            internship_data = {
                "title": title,
                "company": company,
                "location": location,
                "duration": duration,
                "stipend": stipend,
                "posted_time": posted_time,
                "link": link
            }

            internship_details.append(internship_data)

        except Exception:
            continue  # Skip the internship if any error occurs

    return internship_details

# Call the function
# internships = scrape_internships()
# print(internships)
