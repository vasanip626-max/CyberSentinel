from database.db import db

# Employees Collection
employees = db["employees"]


def get_all_employees():
    """
    Fetch all employees from MongoDB
    """
    return list(
        employees.find(
            {},
            {
                "_id": 0
            }
        )
    )


def get_employee(emp_id):
    """
    Fetch a single employee using Employee ID
    """

    print(f"Searching Employee ID: {emp_id}")

    employee = employees.find_one(
        {
            "id": emp_id
        },
        {
            "_id": 0
        }
    )

    print("Employee Found:", employee)

    return employee