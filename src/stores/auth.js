import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { ref } from "vue";

const user = ref(null)

onAuthStateChanged(auth,(firebaseUser)=>{
    user.value = firebaseUser
})


//HOW TO USE:
//   Crear funcion registrar async
//          const res = await doRegister(email.value, password.value)
//          if(res.ok) >>>>>>> EL REGISTRO FUNCIONO!
//              y ya hacemos las pirulas necesarias
const doRegister = async(email, password)=>{
    try {
        const credenciales = await createUserWithEmailAndPassword(auth, email, password)
        return{
            ok:true,
            user : credenciales
        }
    } catch (error) {
        console.log(error)
    }

}

//HOW TO USE:
//   Crear funcion logear
//          const res = await doLogin(email.value, password.value)
//          if(res.ok) >>>>>>> EL REGISTRO FUNCIONO!
//              y ya hacemos las pirulas necesarias
const doLogin = async(email, password)=>{
    try {
        const credenciales = await signInWithEmailAndPassword(auth, email, password)
        return{
            ok:true,
            user:credenciales
        }
    } catch (error) {
        console.log(error)
    }

}
// HOW TO USE:
//     crear funcion salir async
//         await logout() y ya
// if res.ok => ya hacemos cosas
const logOut = async()=>{
    try {
        await signOut(auth)
        return{
            ok:true
        }
    } catch (error) {
        console.log(error)
    }
}


//HOW TO USE:
const sendEmail = async()=>{
    try {
        if(user.value.emailVerified){
            return{
                mensaje: "Usuario ya verificado"
            }
        }
        await sendEmailVerification(user.value)
        return{
            mensaje : "email enviado",
            ok: true
        }
    } catch (error) {
        console.log(error)
    }
}

export const estaAutenticado = () => {
    return user.value !== null
}

export const obtenerUsuario = () => {
    return user.value
}

export {doLogin, doRegister, logOut, sendEmail, user}
