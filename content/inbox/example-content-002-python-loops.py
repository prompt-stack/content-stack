"""
Python Loops Cheat Sheet
A quick reference for different loop patterns in Python
"""

# 1. Basic for loop
print("Basic for loop:")
for i in range(5):
    print(f"Count: {i}")

# 2. Looping through a list
print("\nLooping through a list:")
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# 3. While loop
print("\nWhile loop:")
count = 0
while count < 3:
    print(f"While count: {count}")
    count += 1

# 4. List comprehension
print("\nList comprehension:")
squares = [x**2 for x in range(5)]
print(f"Squares: {squares}")

# 5. Enumerate for index and value
print("\nEnumerate example:")
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# 6. Dictionary iteration
print("\nDictionary iteration:")
person = {"name": "Alice", "age": 30, "city": "NYC"}
for key, value in person.items():
    print(f"{key}: {value}")

# 7. Break and continue
print("\nBreak and continue:")
for i in range(10):
    if i == 3:
        continue  # Skip 3
    if i == 7:
        break  # Stop at 7
    print(i)

# 8. Nested loops
print("\nNested loops - multiplication table:")
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i*j}", end="  ")
    print()  # New line