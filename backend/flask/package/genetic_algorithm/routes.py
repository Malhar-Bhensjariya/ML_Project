from flask import Blueprint, request, jsonify, current_app
import random

genetic_bp = Blueprint("genetic_bp", __name__)

class Lecture:
    def __init__(self, title, mentor, mentees, duration):
        self.title = title
        self.mentor = mentor
        self.mentees = mentees
        self.duration = duration

    def __repr__(self):
        return f"{self.title} (Duration: {self.duration} mins)"

def generate_time_slots():
    """Generate available time slots from 8:00 to 15:00 in 30-minute intervals."""
    slots = []
    for start_hour in range(8, 15):
        for start_min in [0, 30]:
            slots.append((start_hour, start_min))
    return slots

def check_conflict(schedule, lecture, slot):
    """Check if assigning a lecture to a slot causes conflicts."""
    start_hour, start_min = slot
    end_hour = start_hour + (start_min + lecture.duration) // 60
    end_min = (start_min + lecture.duration) % 60
    new_range = [(h, m) for h in range(start_hour, end_hour + 1)
                 for m in (0, 30) if (h, m) >= (start_hour, start_min) and (h, m) <= (end_hour, end_min)]

    for existing in schedule.values():
        existing_range = [(h, m) for h in range(existing['start'][0], existing['end'][0] + 1)
                          for m in (0, 30) if (h, m) >= existing['start'] and (h, m) <= existing['end']]

        if (lecture.mentor == existing['mentor'] or set(lecture.mentees) & set(existing['mentees'])):
            if any(time in existing_range for time in new_range):
                return True  # Conflict detected
    return False

def create_schedule(lectures, time_slots):
    """Create a conflict-free schedule using a greedy approach."""
    schedule = {}
    random.shuffle(time_slots)

    for lecture in lectures:
        for slot in time_slots:
            if not check_conflict(schedule, lecture, slot):
                end_hour = slot[0] + (slot[1] + lecture.duration) // 60
                end_min = (slot[1] + lecture.duration) % 60
                schedule[lecture.title] = {
                    'start': slot,
                    'end': (end_hour, end_min),
                    'mentor': lecture.mentor,
                    'mentees': lecture.mentees
                }
                break  # Move to the next lecture
    return schedule

def evaluate_fitness(schedule):
    """Evaluate the fitness of a schedule based on the number of conflicts."""
    conflicts = 0
    for lecture1 in schedule.values():
        for lecture2 in schedule.values():
            if lecture1 == lecture2:
                continue
            if (lecture1['mentor'] == lecture2['mentor'] or set(lecture1['mentees']) & set(lecture2['mentees'])):
                if times_overlap(lecture1, lecture2):
                    conflicts += 1
    return -conflicts  # Lower conflicts mean higher fitness

def times_overlap(lecture1, lecture2):
    """Check if two lectures overlap."""
    return not (lecture1['end'] <= lecture2['start'] or lecture2['end'] <= lecture1['start'])

def mutate(schedule, lectures, time_slots):
    """Mutate a schedule by reassigning a random lecture to a new non-conflicting time slot."""
    random_lecture = random.choice(lectures)
    for new_slot in random.sample(time_slots, len(time_slots)):
        if not check_conflict(schedule, random_lecture, new_slot):
            end_hour = new_slot[0] + (new_slot[1] + random_lecture.duration) // 60
            end_min = (new_slot[1] + random_lecture.duration) % 60
            schedule[random_lecture.title] = {
                'start': new_slot,
                'end': (end_hour, end_min),
                'mentor': random_lecture.mentor,
                'mentees': random_lecture.mentees
            }
            return schedule
    return schedule

def crossover(schedule1, schedule2):
    """Perform crossover by swapping half of the schedule entries."""
    keys = list(schedule1.keys())
    crossover_point = len(keys) // 2
    for key in keys[:crossover_point]:
        schedule1[key], schedule2[key] = schedule2[key], schedule1[key]
    return schedule1, schedule2

@genetic_bp.route("/", methods=["GET"])
def generate_timetable():
    # Genetic Algorithm Parameters
    generations = 1000
    population_size = 20

    # Sample lectures
    # lectures = [
    #     Lecture("Machine Learning", "mentor1", ["mentee1", "mentee2"], 60),
    #     Lecture("Data Science", "mentor2", ["mentee1", "mentee3"], 90),
    #     Lecture("Deep Learning", "mentor3", ["mentee5", "mentee4"], 120),
    #     Lecture("Artificial Intelligence", "mentor1", ["mentee2", "mentee3"], 90),
    #     Lecture("Computer Vision", "mentor2", ["mentee1", "mentee4"], 75),
    #     Lecture("Natural Language Processing", "mentor4", ["mentee5", "mentee3"], 90),
    #     # Lecture("Reinforcement Learning", "mentor3", ["mentee4"], 60),
    #     # Lecture("Big Data Analytics", "mentor3", ["mentee1"], 120),
    #     # Lecture("Robotics", "mentor1", ["mentee2"], 90),
    #     # Lecture("Cloud Computing", "mentor2", ["mentee3"], 60),
    #     # Lecture("Quantum Computing", "mentor4", ["mentee4", "mentee5"], 60)
    # ]
    
    lectures = [
    Lecture("Machine Learning", "Nilay Rathod", ["Malhar Bhensjariya", "Kshitij Poojary", "Joshua Menezes"], 60),
    Lecture("Data Science", "Prof. Ashok", ["Malhar Bhensjariya", "Joshua Menezes"], 90),
    Lecture("Deep Learning", "Cain", ["Mokshit"], 120),
    Lecture("Artificial Intelligence", "Prof Andrew", ["Joshua Menezes"], 90),
    Lecture("Computer Vision", "Prof. Ashok", ["Malhar Bhensjariya", "Jason Bourne", "Kshitij Poojary"], 75),
    Lecture("Natural Language Processing", "Prof Andrew", ["Jason Bourne", "Mokshit", "Joshua Menezes"], 90),
    # Lecture("Reinforcement Learning", "Dr. Anil Patel", ["Chaya"], 60),
    # Lecture("Big Data Analytics", "Dr. Anil Patel", ["Aarav"], 120),
    # Lecture("Robotics", "Dr. Rajesh Kumar", ["Ananya"], 90),
    # Lecture("Cloud Computing", "Prof. Priya Sharma", ["Bhavesh"], 60),
    # Lecture("Quantum Computing", "Dr. Sneha Reddy", ["Chaya", "Dhruv"], 60)
    ]

    # Generate available time slots
    time_slots = generate_time_slots()

    # Generate initial population
    population = [create_schedule(lectures, time_slots) for _ in range(population_size)]

    # Run genetic algorithm
    for generation in range(generations):
        population.sort(key=evaluate_fitness, reverse=True)
        population = population[:population_size // 2]
        new_population = population.copy()
        while len(new_population) < population_size:
            parent1, parent2 = random.sample(population, 2)
            child1, child2 = crossover(parent1.copy(), parent2.copy())
            new_population.append(mutate(child1, lectures, time_slots))
            new_population.append(mutate(child2, lectures, time_slots))
        population = new_population

    # Best schedule output
    best_schedule = population[0]
    return jsonify(best_schedule)