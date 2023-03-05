# README

## Introduction

This project is a semester project from Noroff - A project with where we were to deliver a Web Application that allows the company to keep track of employees, and check in and out of the office.

This application allows you to view, add, and update staff members time in and out of office. The application also allows you to view and register delivery drivers with a set return time. The system uses the [Random User API](https://randomuser.me/) to generate sample staff members and displays them in a table. You can select a staff member from the table, update their status to "Out", and enter their absense duration, and get a expected return time.
The delivery drivers are objects created from an input form, and then applied to a delivery board, displaying the active drivers.

If a staff member is late returning to the office, the application changes their status to "late" and displays a toast notification.
If a delivery driver is late returning from their delivery, the application will show a toast notification. 

Icons for motorcycle and car in the Delivery Table is from the [fontawesome](https://fontawesome.com/) library, and is used by linking to the CDN.

## Installation

1. Clone the repository or download the ZIP file.

2. Navigate to the Web Application folder.

3. Open index.html in your preferred browser.

### This web application makes use of the following:

* HTML5

* CSS3

* JavaScript

* Bootstrap v5.1.3

* jQuery v3.6.0

* Font Awesome v5.15.4

* Random User Generator API

## Usage

Once the table is populated, you can select a staff member by clicking on their row in the table.

Click the Check Out button to prompt for the duration of the check out time. Enter the duration in minutes.

The staff member will now be listed as Out in the staff table with the time of check out and the expected return time.

When the expected return time is reached, the staff member will be listed as Late and a toast notification will be displayed.

Clicking the "In" button will reset the staff members status and time content, and clear the table row.

## APIs

The application uses the Random User API to generate sample staff members using the fetched data as parameters for the class Staff.