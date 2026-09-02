import axios from "axios";
import qs from "qs";
const baseUrl = "http://localhost:3008/api"; // Replace with your actual API base URL
class apiServices {

 getToken() {
        let obj = {
            authorization: sessionStorage.getItem("token")
        }
        return obj;
    }

login(data){
    return axios.post(`${baseUrl}/login`, data);
}

getallUsers(data) {
    return axios.post(`${baseUrl}/user/all`, data, { headers: this.getToken() })
}

getsingleUser(data) {
    return axios.post(`${baseUrl}/user/single`, data, { headers: this.getToken() })
}

addUser(data) {
    return axios.post(`${baseUrl}/user/add`, data, { headers: this.getToken() })
}
updateUser(data) {
    return axios.post(`${baseUrl}/user/update`, data, { headers: this.getToken() })
}

deleteUser(data) {
    return axios.post(`${baseUrl}/user/delete`, data, { headers: this.getToken() })
}
//Roles
getallRoles(data) {
    return axios.post(`${baseUrl}/role/all`, data, { headers: this.getToken() })
}

addRole(data) {
    return axios.post(`${baseUrl}/role/add`, data, { headers: this.getToken() })
}

updateRole(data) {
    return axios.post(`${baseUrl}/role/update`, data, { headers: this.getToken() })
}


deleteRole(data) {
    return axios.post(`${baseUrl}/role/delete`, data, { headers: this.getToken() })
}
//workers
getallWorkers(data) {
    return axios.post(`${baseUrl}/worker/all`, data, { headers: this.getToken() })  

}
addWorker(data) {
    return axios.post(`${baseUrl}/worker/add`, data, { headers: this.getToken() })
}
getsingleWorker(data) {
    return axios.post(`${baseUrl}/worker/single`, data, { headers: this.getToken() })

}
updateWorker(data) {
    return axios.post(`${baseUrl}/worker/update`, data, { headers: this.getToken() })
}

deleteWorker(data) {
    return axios.post(`${baseUrl}/worker/delete`, data, { headers: this.getToken() })
}

//borrowers
getallBorrowers(data) {
    return axios.post(`${baseUrl}/borrower/all`, data, { headers: this.getToken() })
}
addBorrower(data) {
    return axios.post(`${baseUrl}/borrower/add`, data, { headers: this.getToken() })
}
getsingleBorrower(data) {
    return axios.post(`${baseUrl}/borrower/single`, data, { headers: this.getToken() })
}
updateBorrower(data) {
    return axios.post(`${baseUrl}/borrower/update`, data, { headers: this.getToken() })
}
deleteBorrower(data) {
    return axios.post(`${baseUrl}/borrower/delete`, data, { headers: this.getToken() })
}
//loan Type
getallLoanTypes(data) {
    return axios.post(`${baseUrl}/loan-type/all`, data, { headers: this.getToken() })

}
getsingleLoanType(data) {
    return axios.post(`${baseUrl}/loan-type/single`, data, { headers: this.getToken() })

}
addLoanType(data) {
    return axios.post(`${baseUrl}/loan-type/add`, data, { headers: this.getToken() })
}
updateLoanType(data) {
    return axios.post(`${baseUrl}/loan-type/update`, data, { headers: this.getToken() }) 
}
deleteLoanType(data) {
    return axios.post(`${baseUrl}/loan-type/delete`, data, { headers: this.getToken() })
}
//loan
getallLoans(data) {
    return axios.post(`${baseUrl}/loan/all`, data, { headers: this.getToken() })
}
getsingleLoan(data) {
    return axios.post(`${baseUrl}/loan/single`, data, { headers: this.getToken() })
}
addLoan(data) {
    return axios.post(`${baseUrl}/loan/add`, data, { headers: this.getToken() })
}
updateLoan(data) {
    return axios.post(`${baseUrl}/loan/update`, data, { headers: this.getToken() })
}
deleteLoan(data) {
    return axios.post(`${baseUrl}/loan/delete`, data, { headers: this.getToken() })
}
}
export default new apiServices();