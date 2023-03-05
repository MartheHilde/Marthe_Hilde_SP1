//DATE AND TIMESTAMP, 1SEC
function timeStamp() {
    const timestamp = document.querySelector('#timeStamp');
    const currentDate = new Date();
    timestamp.innerHTML = currentDate.toLocaleString("en-UK", {hour12: false});
}
setInterval(timeStamp, 1000);

//LOADING TABLE WITH CONTENT FIRST
window.onload = () => {
    randomUserGenerator();
}


//API to CLASS to TABLE
class Employee {
    constructor(name, surname){
        this.name = name;
        this.surname = surname;
    }
}

class StaffMember extends Employee {
    constructor(picture, name, surname, email, status, outTime, duration, expectedReturnTime) {
        super(name, surname)
        this.picture = picture;
        this.email = email;
        this.status = status;
        this.outTime = outTime;
        this.duration = duration;
        this.expectedReturnTime = expectedReturnTime;
    }
    staffMemberIsLate() {
        const toast = $("#lateStaffToast");
        toast.find(".toast-body").text(`Staff member ${this.name} ${this.surname} is late. They have been out of office for ${this.duration} minutes.`);
        toast.find(".img").html(`<img src="${this.picture}">`);
        toast.toast("show");
    }
}

//POPULATE STAFF
let staffList = [];
const randomUserGenerator = () => {
    fetch('https://randomuser.me/api/?results=5')
    .then((response) => {
        return response.json()
    }).then((data) => {
        const tableBody = document.querySelector("#staffTable tbody");
        data.results.forEach((staffData) => {
            const staff = new StaffMember(
                staffData.picture.thumbnail,
                staffData.name.first,
                staffData.name.last,
                staffData.email,
                "In", //DEFAULT
                "",
                "",
                ""
            );

            //ADD STAFF TO LIST ARRAY
            staffList.push(staff); 
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${staff.picture}" alt="${staff.name} ${staff.surname}" /></td>
                <td>${staff.name}</td>
                <td>${staff.surname}</td>
                <td>${staff.email}</td>
                <td>${staff.status}</td>
                <td>${staff.outTime}</td>
                <td>${staff.duration}</td>
                <td>${staff.expectedReturnTime}</td>
            `;

            $(row).on('click', function() {
            $(this).siblings('tr.selected').removeClass('selected');  
            $(this).addClass("selected");
            });
        
        tableBody.appendChild(row);

        });
    });
};


//REGISTER STAFF OUT OF OFFICE
const staffOut = () => {
    const selectedRow = $("#staffTable tbody tr.selected");
    if (selectedRow.length === 0) {
        alert("Please select a staff member.");
        return;
    }

    const selectedStaffName = selectedRow.find("td:nth-child(2)").text();

    //PROMPT
    const durationInMinutes = parseInt(prompt("Duration (in minutes):"));
    if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
        alert("Please enter a valid duration in minutes.");
        return;
    }

    //CALCULATING TIME FROM MINUTES
    const outTime = new Date();
    const expectedReturnTime = new Date(outTime.getTime() + durationInMinutes * 60000);

    //OUT TIME AND EXP RETURN TIME IN TABLE
    selectedRow.find("td:nth-child(5)").text("Out");
    selectedRow.find("td:nth-child(6)").text(outTime.toLocaleTimeString("en-US", {hour12: false}));

    //MINUTE TO HH:MM
    selectedRow.find("td:nth-child(7)").text(`${Math.floor(durationInMinutes / 60)}:${durationInMinutes % 60}`); 
    selectedRow.find("td:nth-child(8)").text(expectedReturnTime.toLocaleTimeString("en-US", {hour12: false}));

    //UPDATES OBJECT TO USE staffMemberIsLate();
    const staffMember = staffList.find((staff) => staff.name === selectedStaffName);
    staffMember.status = "Out";
    staffMember.outTime = outTime;
    staffMember.duration = `${Math.floor(durationInMinutes / 60)}:${durationInMinutes % 60}`;
    staffMember.expectedReturnTime = expectedReturnTime.toLocaleTimeString("en-US", {hour12: false});

    // Check if staff member is late
    const checkLateStatus = setInterval(() => {
        const currentDateTime = new Date();
        if (currentDateTime > expectedReturnTime) {
            clearInterval(checkLateStatus);

            staffMember.status = "Late";
            staffMember.staffMemberIsLate();
            selectedRow.find("td:nth-child(5)").text("Late");
        }
    }, 1000);
};
//CHECK STAFF BACK IN - NULLIFY ALL TIME
const staffIn = () => {
    const selectedStaffRow = $("#staffTable tbody tr.selected");
    if (selectedStaffRow.length === 0) {
    alert("Please select a staff member.");
    return;
    }

    selectedStaffRow.find("td:eq(5)").text("");
    selectedStaffRow.find("td:eq(6)").text("");
    selectedStaffRow.find("td:eq(7)").text("");
    selectedStaffRow.find("td:eq(4)").text("In");

    const selectedStaffName = selectedStaffRow.find("td:nth-child(2)").text();
    const staffMember = staffList.find(staff => staff.name === selectedStaffName);
    staffMember.status = "In";
    staffMember.outTime = "";
    staffMember.duration = "";
    staffMember.expectedReturnTime = "";
};


/*
VEHICLEDRIVER CLASS
*/

class DeliveryDriver extends Employee {
    constructor(vehicle, name, surname, telephone, address, returnTime) {
        super(name, surname),
        this.vehicle = vehicle,
        this.telephone = telephone,
        this.address = address,
        this.returnTime = returnTime
    }
    deliveryDriverIsLate() {
        const toast = $("#deliveryToast");
        toast.find(".toast-body").text(`Delivery driver ${this.name} ${this.surname} for ${this.address} is late. Expected return time was ${this.returnTime}. The drivers phone number is ${this.telephone}.`);
        toast.toast("show");
    }
}


let drivers = [];
//GET DATA
function addDelivery() {
    const vehicle = $('select[name="vehicle"]').val() === "option1" ? "car" : "motorcycle";
    const name = $('input[name="name"]').val();
    const surname = $('input[name="surname"]').val();
    const telephone = $('input[name="telephone"]').val();
    const address = $('input[name="address"]').val();
    const returnTime = $('input[name="return_time"]').val();

    //REGEX FOR VALIDATION:
    const validName = /^[a-zA-Z\s]*$/;
    const validPhone = /^\d{8,}$/;
    const validAddress = /^[0-9a-zA-Z\s]{1,255}$/;
    const validTimeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

    //CREATE NEW DRIVER 
    //VALIDATION OF DATA USING REGEX
    if (vehicle == 'car' ||  vehicle == 'motorcycle') {
        if (name.match(validName) && surname.match(validName) && telephone.match(validPhone) && address.match(validAddress) && returnTime.match(validTimeFormat)) {
            const deliveryBody = document.querySelector("#deliveryTable tbody");
            //NEW DRIVER FROM DELIVERYDRIVER CLASS BASED ON INPUT
            const driver = new DeliveryDriver(
                vehicle, 
                name, 
                surname, 
                telephone, 
                address, 
                returnTime);

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
            <td><i class="fa fa-${vehicle}"></i></td>
            <td>${driver.name}</td>
            <td>${driver.surname}</td>
            <td>${driver.telephone}</td>
            <td>${driver.address}</td>
            <td>${driver.returnTime}</td>
            `
            deliveryBody.appendChild(newRow);
            
            //HIGHLIGHT TR ON CLICK
            $("#deliveryTable tbody tr").click(function() {
                $("#deliveryTable tbody tr").removeClass("selectedDriver");
                $(this).addClass("selectedDriver");
            });
            // ADD THE DRIVER TO THE LIST OF DRIVERS
            drivers.push(driver);

        const today = new Date();
        const expectedReturnTime = (new Date(today.toDateString() + ' ' + returnTime));
        //CHECK IF DRIVER IS LATE - deliveryDriverIsLate()
        const checkLateStatus = setInterval(() => {
            const currentDateTime = new Date().getTime();
                if (currentDateTime > expectedReturnTime) {
                    clearInterval(checkLateStatus);
                    driver.deliveryDriverIsLate();
                }
            }, 1000);
        } else {
            alert("Please enter valid input for all fields.");
        }
    }
}

//REMOVE DRIVER AND ASK FOR CONFIRMATION
function clearDeliveryDriver() {
    const selectedRow = $("#deliveryTable tbody tr.selectedDriver");
    if (selectedRow.length > 0) {
        const index = selectedRow.index();
        const confirmDelete = confirm("Are you sure you want to clear this delivery driver?");
        if (confirmDelete) {
            selectedRow.remove();
            drivers.splice(index, 1);
        }
    } else {
        alert("Please select a Delivery Driver.")
    }
}



