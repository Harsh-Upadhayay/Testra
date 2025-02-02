import re
import json
import requests

# Function to parse the input file and extract questions
def parse_questions(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    # Regular expression to match each question block
    question_pattern = re.compile(
        r'### (.*?)\n'  # Question text
        r'(- \[[x ]\] .*?\n)+'  # Options
        r'(\[\^.*?\n)?'  # Optional back to top link
        r'(?=\n###|\Z)',  # Lookahead for next question or end of file
        re.DOTALL
    )

    questions = []
    for match in question_pattern.finditer(content):
        question_text = match.group(1).strip()
        options = re.findall(r'- \[([x ])\] (.*?)\n', match.group(0))  # Extract options with [x] or [ ]
        
        # Separate the correct answer and clean the options
        cleaned_options = []
        correct_answer = None
        for i, (marker, option_text) in enumerate(options):
            cleaned_options.append(option_text.strip())
            if marker == 'x':
                correct_answer = i  # Index of the correct option

        # If no correct answer is found, skip this question
        if correct_answer is None:
            print(f"Skipping question: No correct answer found for '{question_text}'")
            continue

        # Create the question dictionary
        question = {
            "text": question_text,
            "options": cleaned_options,
            "correct_answer": correct_answer,
            "explanation": "",  # You can add explanations if available
            "tags": ["AWS", "EC2", "EBS"],  # Example tags, adjust as needed
            "time_limit": 60,  # Example time limit, adjust as needed
            "exam_id": 1  # Example exam ID, adjust as needed
        }
        questions.append(question)

    return questions

# Function to post questions to the API
def post_questions(questions, api_url):
    headers = {'Content-Type': 'application/json'}
    for question in questions:
        response = requests.post(api_url, data=json.dumps(question), headers=headers)
        if response.status_code == 200:
            print(f"Question posted successfully: {question['text']}")
        else:
            print(f"Failed to post question: {question['text']}")
            print(f"Response: {response.status_code}, {response.text}")

# Main function
def main():
    file_path = 'questions.txt'  # Path to your input file
    api_url = 'http://localhost:8000/questions/'  # Replace with your actual API endpoint

    questions = parse_questions(file_path)
    post_questions(questions, api_url)

if __name__ == "__main__":
    main()