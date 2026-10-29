from flask import Blueprint, jsonify

from models.employee import get_all_employees, get_employee
from models.attack import save_attack
from flask import request

employee = Blueprint(

    "employee",

    __name__

)


@employee.route(

    "/employees",

    methods=["GET"]

)

def employees():

    return jsonify(

        get_all_employees()

    )


@employee.route(

    "/employee/<int:id>",

    methods=["GET"]

)

@employee.route("/employee/<int:id>", methods=["GET"])
def employee_details(id):

    employee = get_employee(id)

    if not employee:

        return jsonify({

            "message": "Employee not found"

        }),404


    # -------------------------------
    # Temporary IDOR Detection Logic
    # -------------------------------

    if id > 3:

        save_attack(

            attack_type="IDOR",

            severity="High",

            ip_address=request.remote_addr,

            employee_id=id,

            description=f"Unauthorized attempt to access Employee ID {id}"

        )

    return jsonify(employee)