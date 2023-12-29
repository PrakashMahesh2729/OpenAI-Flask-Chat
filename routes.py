from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(api_key="Your API")
assistant = client.beta.assistants.retrieve("Your Assistant Id")
thread = client.beta.threads.create()

@app.route('/')
def home():
    return render_template('chat.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.form['message']

    # Create a new thread
    thread = client.beta.threads.create()

    # Send the user's message to the assistant
    message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=user_input)

    client.beta.threads.messages.list(thread_id=thread.id).data

    # Run the assistant
    run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id
    )

    # Wait for the assistant's response (this is a blocking operation)
    while True:
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        if run.status == "completed":
            messages = client.beta.threads.messages.list(thread_id=thread.id)
            latest_message = messages.data[0] # Get the last message
            text = latest_message.content[0].text.value
            return jsonify({'response': text})

    return jsonify({'response': "Sorry, I couldn't find an appropriate response."})


if __name__ == '__main__':
    app.run(debug=True)
