const userLogin = {
    url: 'https://hp.chitkara.edu.in//Interface/index.php',
    success: 'https://hp.chitkara.edu.in//Interface/Student/scIndex.php'
}

const userInfo = {
    url: "https://hp.chitkara.edu.in//Interface/Student/studentInformation.php",
    firstName: "#tabViewdhtmlgoodies_tabView1_0 > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3)",
    lastName: "#tabViewdhtmlgoodies_tabView1_0 > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(6)",
    rollno: "#tabViewdhtmlgoodies_tabView1_0 > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(3)",
    email: "#tabViewdhtmlgoodies_tabView1_0 > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(3)",
    image: ".field1_heading"
}

export default {
    userLogin,
    userInfo
}