from transformers import GPT2LMHeadModel, GPT2Tokenizer
import streamlit as st

# Function to get response from LLama 2 model
def getLLamaresponse(input_text, no_words, blog_style):
    # Local path to the downloaded GGUF model file
    model_path = "D:/Linearloop Internship/Project/mistral-7b-openorca.gguf2.Q4_0.gguf"  # Replace with the actual model file path

    # Initialize the model and tokenizer
    model = GPT2LMHeadModel.from_pretrained(model_path)
    tokenizer = GPT2Tokenizer.from_pretrained(model_path)

    # Prompt Template
    template = """
        Write a blog for {blog_style} job profile for a topic {input_text}
        within {no_words} words.
            """
    prompt = template.format(blog_style=blog_style, input_text=input_text, no_words=no_words)

    # Tokenize the prompt
    inputs = tokenizer(prompt, return_tensors="pt", max_length=1024, truncation=True)

    # Generate the response
    output = model.generate(
        inputs.input_ids,
        max_length=no_words + len(prompt.split()),
        temperature=0.01,
        pad_token_id=tokenizer.eos_token_id,
        return_sequences=True,
    )

    # Decode the response
    response = tokenizer.decode(output[0], skip_special_tokens=True)

    return response


# Streamlit UI
st.set_page_config(page_title="Blog Generator",
                    page_icon='📝',
                    layout='centered',
                    initial_sidebar_state='collapsed')

st.header("Blog Generator 📝")

input_text = st.text_input("Enter the Blog Topic")

# Additional input fields
no_words = st.number_input('No of Words', value=200)
blog_style = st.selectbox('Writing the blog for', ('Researchers', 'Data Scientist', 'Common People'), index=0)

submit = st.button("Generate Blog")

# Final response
if submit:
    generated_blog = getLLamaresponse(input_text, int(no_words), blog_style)
    st.write("Generated Blog:", generated_blog)