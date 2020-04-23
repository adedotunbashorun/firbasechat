import firebase from 'firebase';

export const writeData = (url, data ) => {
    firebase.database().ref(url).push().set(data).catch((error) => {
        alert("Error adding document: ", error)
    });
}

export const getData = (url) => {
    let data = [];
    firebase.database().ref(url).on('value', (snapshot) => {
        snapshot.forEach((doc) => {
            let item = doc.val()
            item.key = doc.key
            data.push(item);
        });
    })
    return data;
}

export const login = (form) => {
    firebase
        .auth()
        .signInWithEmailAndPassword(form.email, form.password)
        .then( () => {
            return true;
        })
        .catch(err => {
            throw new Error(err.message);
        });
}

export const register = (formReg) => {
    firebase
            .auth()
            .createUserWithEmailAndPassword(formReg.email, formReg.password)
            .then(data => {
            data.user
                .updateProfile({
                displayName: formReg.name
                })
                .then(() => {
                    return true;
                });
            })
            .catch(err => {
                throw new Error(err.message);
            });
}