import pandas as pd
import numpy as np
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords


def requirementbased(city, attractions, main_df):
    main_df['Place'] = main_df['Place'].str.lower()
    main_df['Data'] = main_df['Data'].str.lower()
    attractions = attractions.lower()
    attractions_token = word_tokenize(attractions)
    sw = stopwords.words('english')
    lemm = WordNetLemmatizer()
    f1_set = {w for w in attractions_token if not w in sw}
    f_set = set()
    for se in f1_set:
        f_set.add(lemm.lemmatize(se))
    reqbased = main_df[main_df['City'] == city.lower()]
    if reqbased.empty:
        print("No attractions data found for this city.")
        return None
    if city and not attractions: # Check if only city is provided
        reqbased = reqbased.sort_values(by='Rating', ascending=False).reset_index(drop=True)
    else:
        reqbased = reqbased.sort_values(by='Rating', ascending=False).reset_index(drop=True)
    cos = []

    for i in range(reqbased.shape[0]):
        temp_tokens = word_tokenize(reqbased['Data'][i])
        temp1_set = {w for w in temp_tokens if not w in sw}
        temp_set = set()
        for se in temp1_set:
            temp_set.add(lemm.lemmatize(se))
        revector = temp_set.intersection(f_set)
        cos.append(len(revector))
    reqbased['Similarity'] = cos
    reqbased = reqbased.sort_values(by='Similarity', ascending=False).reset_index(drop=True)
    return reqbased[['Place', 'City', 'Rating', 'Description', 'Similarity']].head(10)
