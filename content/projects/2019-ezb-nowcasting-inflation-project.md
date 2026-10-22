---
id: nowcasting-inflation-project
title: "ECB Hackathon: COICOP Product Classification for Inflation Nowcasting"
articleDate: 2019-09-01
articleContent: I built a Python and scikit-learn product classifier for 5,000+ COICOP categories at a three-day ECB hackathon. Word embeddings and logistic regression reached 99.82% accuracy.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Machine-learning developer
outcome: Reached 99.82% classification accuracy with a deliberately simple model that outperformed more complex alternatives.
metrics:
  - label: Accuracy
    value: 99.82%
  - label: COICOP categories
    value: 5,000+
  - label: Team
    value: 4 master's students
tags:
  - ArtificialIntelligence
  - DataScience
  - NowcastingInflation
  - MachineLearning
technologies:
  - Python
  - Google-Colab
  - Scikit-learn
  - Seaborn
---

The most useful result from the hackathon was not the model. It was the decision not to make the model bigger.

## The problem

At a three-day European Central Bank hackathon, our team of four master's students tackled a classification problem with direct economic relevance: assign online products to the correct COICOP category. More than 5,000 categories were possible, and accurate classification supports inflation nowcasting.

The difficult part was not the number of classes alone. Product descriptions are messy, short, and inconsistent. A model could appear accurate on the aggregate while failing on the categories where a wrong assignment matters most. We had three days to choose an approach, evaluate it, and explain it to a room of economists and engineers.

## The build

I worked on the model in Python with Google Colab and scikit-learn. We prepared the data, trained models, tested outcomes, and used Seaborn to make performance comparisons visible to the team. The project required an approach that could be implemented, evaluated, and explained within the hackathon's short timeframe.

We chose word embeddings with logistic regression after it outperformed more complex alternatives, including deep neural networks and binary tree classifiers. The resulting model reached 99.82% accuracy. This was an important engineering decision: the more sophisticated option was not automatically the stronger one for this data or this deadline. A smaller model also made it easier to explain why a classification had gone wrong.

The team combined different skill levels and backgrounds, so a clear division of work was essential. I focused on the machine-learning approach while the team collectively handled preprocessing, testing, validation, and presentation. We agreed on the evaluation metric before comparing models, which kept the discussion about evidence rather than preference.

The evaluation also forced us to think about class imbalance. With more than 5,000 categories, a high aggregate accuracy can hide weak performance on rare classes. We looked beyond the headline number during model selection and kept the comparison honest by using the same data split. In a longer project I would make macro-level metrics and per-category error analysis part of the first notebook, not a retrospective improvement.

## The result

Our model reached 99.82% accuracy across more than 5,000 COICOP categories. The result was strong, but the more valuable outcome was a repeatable decision process: establish a baseline, compare alternatives on the same split, and choose the simplest model that survives scrutiny.

## What I took from it

If I repeated this project today, I would add more explicit per-category error analysis and document the evaluation split before reporting an aggregate accuracy. The underlying lesson remains the same: start with the smallest model that fits the problem, then add complexity only when the results justify it. A number is persuasive only when the person reading it understands how it was produced.
