from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for testing

# Extended list of questions
questions = [
    "What is your name?",
    "What are your skills?",
    "What is your experience with React?",
]

answers = []
questions_and_answers = []  # List to store questions and answers
Text_extracted_from_the_resume = ""  # Variable to store extracted resume text

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    global Text_extracted_from_the_resume
    try:
        resume = request.files['resume']
        resume_path = os.path.join('resumes', resume.filename)
        resume.save(resume_path)

        # Extract text from resume
        resume_text_data = ""
        if resume_path.endswith('.pdf'):
            with open(resume_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    resume_text_data += page.extract_text()
        else:
            with open(resume_path, 'r') as f:
                resume_text_data = f.read()

        # Store and print resume text
        Text_extracted_from_the_resume = resume_text_data
        print("Extracted Resume Text:\n", Text_extracted_from_the_resume)

        return jsonify({'resume_text_data': resume_text_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_question', methods=['GET'])
def get_question():
    try:
        if len(questions) > 0:
            question = questions.pop(0)
            return jsonify({'question': question})
        return jsonify({'question': 'No more questions'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    try:
        data = request.get_json()
        questions_and_answers.append(data)  # Save question and answer
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/calculate_score', methods=['GET'])
def calculate_score():
    try:
        score = len(questions_and_answers) * 10  # Example scoring mechanism
        
        # Print all questions and answers to the terminal
        print("\nQuestions and Answers:")
        for qa in questions_and_answers:
            print(f"Question: {qa['question']}")
            print(f"Answer: {qa['answer']}")
            print("-" * 40)
        
        return jsonify({'score': score})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_questions_and_answers', methods=['GET'])
def get_questions_and_answers():
    try:
        return jsonify({'questions_and_answers': questions_and_answers})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists('resumes'):
        os.makedirs('resumes')
    app.run(debug=True)
