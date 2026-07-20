---
id: nowcasting-inflation-project
title: "ECB Hackathon: COICOP Product Classification for Inflation Nowcasting"
articleDate: 2019-09-01
articleContent: I built a Python and scikit-learn product classifier for 5000+ COICOP categories at a three-day ECB hackathon. Word embeddings and logistic regression reached 99.82% accuracy, outperforming more complex alternatives.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
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

At a three-day European Central Bank hackathon, our team of four master's students tackled a classification problem with direct economic relevance: assign online products to the correct COICOP category. More than 5,000 categories were possible, and accurate classification supports inflation nowcasting.

I worked on the model in Python with Google Colab and scikit-learn. We prepared the data, trained models, tested outcomes, and used Seaborn to make performance comparisons visible to the team. The project required an approach that could be implemented, evaluated, and explained within the hackathon's short timeframe.

We chose word embeddings with logistic regression after it outperformed more complex alternatives, including deep neural networks and binary tree classifiers. The resulting model reached 99.82% accuracy. This was an important engineering decision: the more sophisticated option was not automatically the stronger one for this data or this deadline.

The team combined different skill levels and backgrounds, so clear division of work was essential. I focused on the machine-learning approach while the team collectively handled preprocessing, testing, validation, and presentation. The experience showed me that a well-chosen baseline and a shared understanding of the metric are more useful than complexity without evidence.

If I repeated this project today, I would add more explicit per-category error analysis and document the evaluation split before reporting an aggregate accuracy. The underlying lesson remains the same: start with the smallest model that fits the problem, then add complexity only when results justify it.
