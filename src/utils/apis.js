import http from "./http";

export const loginAPI = (payload = {}) => {
    const headers = {
        'Access-Control-Expose-Headers': 'x-xsrf-token'
      };
    return http.post('/users/login', payload, { headers });
};

export const forgotPasswordAPI = async (payload = {}) => {
    console.log(payload);
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    return http.post('/users/forgotPassword', payload, { headers });
  };


export const registrationAPI = (payload = {}) => {

    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        // 'Authorization': 'Bearer ${mytoken}',
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };
    console.log(mytoken);
    console.log(headers);
    console.log(payload);

    return http.post('/personal/addPersonal', payload, { headers });
};

export const organizationAPI = (payload = {}) => {

    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        // 'Authorization': 'Bearer ${mytoken}',
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };
    console.log(mytoken);
    console.log(headers);
    console.log(payload);

    return http.post('/organisation/addOrganisation', payload, { headers });
};

export const bookappointmentAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };

    return http.post('/appointments/createApt', payload, { headers });
};

export const getAppointmentsAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.get('/appointments/getAll', { headers });
};

export const getAppointmentsbyID = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.post('/appointments/getById', payload, { headers });
};

export const followupApt = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.post('/appointments/updateStatus', payload, { headers });
};


export const getVisitorsAPI = () => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.get('/personal/getAll', { headers });
};

export const govtbeneficiariesAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };

    return http.post('/GovtBenfits/addGovtBenfits', payload, { headers });
};

export const villagedevelopmentAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };

    return http.post('/VDWorks/addVdWork', payload, { headers });
};

export const villageleaderAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };

    return http.post('/villageLeaders/addVillageLeader', payload, { headers });
};

export const villagevisitAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };

    return http.post('/MlaVisit/addMlAVists', payload, { headers });
};

export const villagevisitAPIXls = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };

    return http.post('/XlData/MlaXlxsUpload', payload, { headers });
};

export const getPDFAPI = () => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.get('pdf/download-pdf', { headers });
};


export const getvillagevisitAPI = () => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.get('MlaVisit/getAll', { headers });
};

export const getgovtbenefitAPI = () => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.get('GovtBenfits/getAll', { headers });
};

export const getvillagedevelopmentAPI = () => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.get('VDWorks/getAll', { headers });
};

export const getvillageleadersAPI = () => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + mytoken,
        'Content-Type': 'application/json',
        'Access-Control-Expose-Headers': 'x-xsrf-token',
    };

    return http.get('villageLeaders/getAll', { headers });
};

export const govtbeneficiariesGetReportsAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };

    return http.post('/pdf/filter', payload, { headers });
};


export const profileAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };
    return http.put('/users/updateProfile', payload, { headers });
};



export const passwordAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };
    console.log(payload);
    return http.put('/users/updatePassword', payload, { headers });
};

export const changeprofilepicAPI = (payload = {}) => {
    const mytoken = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('_id');
    const cloudUrl = sessionStorage.getItem('cloudUrl');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };
    console.log(payload);
    return http.put('/users/updateImage', payload, { headers });
};


export const getUserById = (body) => {
    const mytoken = sessionStorage.getItem('token');
    const headers = {
        'Authorization': "Bearer "+ mytoken,
        "Access-Control-Allow-Origin": "*",
        'Content-type': 'application/json; charset=UTF-8',
    };
    console.log(body);
    return http.post('/personal/getById', body, { headers });
};