import pandas as pd
import numpy as np
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def recommendor(city, features, price, df):
    df['Name'] = df['Name'].str.lower()
    df['Amenities'] = df['Amenities'].str.lower()
    features = features.lower()
    features_token = word_tokenize(features)
    sw = stopwords.words('english')
    lemm = WordNetLemmatizer()
    f1_set = {w for w in features_token if not w in sw}
    f_set = set()
    for se in f1_set:
        f_set.add(lemm.lemmatize(se))
    
    reqbased = df[df['City'] == city.lower()]
    if reqbased.empty:
        print("No hotels data found for this city.")
        return None
    
    if city and not features and not price:  # Check if only city is provided
        reqbased = reqbased.sort_values(by='Review_Score', ascending=False)
    else:
        reqbased = reqbased[reqbased['Price'] <= price].sort_values(by='Review_Score', ascending=False)
    
    reqbased = reqbased.set_index(np.arange(reqbased.shape[0]))
    cos = []
    
    for i in range(reqbased.shape[0]):
        temp_tokens = word_tokenize(reqbased['Amenities'][i])
        temp1_set = {w for w in temp_tokens if not w in sw}
        temp_set = set()
        for se in temp1_set:
            temp_set.add(lemm.lemmatize(se))
        revector = temp_set.intersection(f_set)
        cos.append(len(revector))
    
    reqbased['Similarity'] = cos
    reqbased = reqbased.sort_values(by='Similarity', ascending=False)
    reqbased.drop_duplicates(subset='_id', keep='first', inplace=True)
    
    return reqbased[['Name', 'Price', 'Review_Score', 'Address', 'Amenities', 'URL', 'Similarity']].head()