from services.matcher import ResumeMatcher

matcher = ResumeMatcher()

# job = """
# Looking for a machine learning engineer with experience in Python,
# TensorFlow, deep learning, and building machine learning pipelines.
# """
job = """
Looking for a Full Stack Developer with experience in JavaScript,
React, Node.js, REST APIs, databases, and cloud deployment.
"""

results = matcher.match(job)

print("\nTop Matching Candidates:\n")

for index, row in results.iterrows():
    print(f"Category: {row['category']}")
    print(f"Similarity Score: {row['score']:.4f}")
    print("-----------------------------")