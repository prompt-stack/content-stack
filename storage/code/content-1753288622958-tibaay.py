import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Python Data Analysis Tutorial
# Learn the fundamentals of data analysis with pandas

# 1. Loading Data
df = pd.read_csv('sales_data.csv')
print(f"Dataset shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")

# 2. Basic Exploration
print(df.head())
print(df.info())
print(df.describe())

# 3. Data Cleaning
# Check for missing values
print(df.isnull().sum())

# Fill missing values
df['price'].fillna(df['price'].mean(), inplace=True)

# 4. Data Analysis
# Group by category
category_sales = df.groupby('category')['revenue'].sum()
print(category_sales)

# Time series analysis
df['date'] = pd.to_datetime(df['date'])
monthly_sales = df.resample('M', on='date')['revenue'].sum()

# 5. Visualization
plt.figure(figsize=(12, 6))

# Sales by category
plt.subplot(1, 2, 1)
category_sales.plot(kind='bar')
plt.title('Sales by Category')
plt.xticks(rotation=45)

# Monthly trend
plt.subplot(1, 2, 2)
monthly_sales.plot(kind='line', marker='o')
plt.title('Monthly Sales Trend')

plt.tight_layout()
plt.show()

# 6. Statistical Analysis
# Correlation matrix
corr_matrix = df[['price', 'quantity', 'revenue']].corr()
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')
plt.title('Correlation Matrix')
plt.show()

# Key Insights:
# - Category A generates highest revenue
# - Strong positive correlation between price and revenue
# - Seasonal patterns in monthly sales