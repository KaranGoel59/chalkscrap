const studentLogin = {
    url: 'https://hp.chitkara.edu.in//Interface/index.php',
    success: 'https://hp.chitkara.edu.in//Interface/Student/scIndex.php'
}

const studentInfo = {
    url: "https://hp.chitkara.edu.in//Interface/Student/studentInformation.php",
    firstName: "#tabViewdhtmlgoodies_tabView1_0 > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3)",
    lastName: "#tabViewdhtmlgoodies_tabView1_0 > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(6)",
    id: "#tabViewdhtmlgoodies_tabView1_0 > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(3)",
    email: "#tabViewdhtmlgoodies_tabView1_0 > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(3)",
    image: "#studentImageId1"
}

const courseInfo = {
    tab: "#tabTabdhtmlgoodies_tabView1_2", 
    xurl: "https://hp.chitkara.edu.in//Library/ScParent/scAjaxSection.php",
}

export default {
    studentLogin,
    studentInfo,
    courseInfo
}