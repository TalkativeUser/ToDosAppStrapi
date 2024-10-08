import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { loginValidationSchema } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useState } from "react";
import axiosInstance from "../config/AxiosConfig";
import { AxiosError } from "axios";
import { IAxiosErrorMsg } from "../interfaces";
import { isIAxiosErrorMsg } from "../config/AxiosConfig";
import { LOGIN_FORM } from "../data";
import InputErrorMsg from "../components/errors/InputErrorMsg";
// import { useNavigate } from "react-router-dom";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {


  const [loader,setLoader]=useState(false)
  // const navigate=useNavigate()

  const { register, handleSubmit ,formState:{errors} } = useForm<IFormInput>( { resolver:yupResolver(loginValidationSchema)} );
  const onSubmit: SubmitHandler<IFormInput> =async (data) => {

  const successToast = () => toast.success(' success loged in ' ,{duration:1300, style:{border:"1px solid green"} });
         setLoader(true)

        //  case ==> fulfilled (success)
        try {

          const {status,data:resData}=await axiosInstance.post('/auth/local',data)
          console.log("%cdata", "color: green; padding: 5px; font-size: 20px;", "=>", resData);

          if(status===200) {
       localStorage.setItem('StrapiToDoUserData',JSON.stringify(resData))

          successToast()
             setTimeout(()=>{
          // navigate('/')
location.replace('/') 
//  لى استخدمنا ال replace  هنا بدل ال  useNavigate  ؟ عشان خاطر 

             },1500)

          }

        }  

          //  case ==> Rejected 

      catch (error) {
              console.log("%cErrorLogin", "color: red; padding: 5px; font-size: 20px;", "=>", error);
              const axiosErrorObject=error as AxiosError <IAxiosErrorMsg> 
                if (axiosErrorObject.response && isIAxiosErrorMsg(axiosErrorObject.response.data)) {
                  toast.error(` ${axiosErrorObject.response.data.error.message} `, { style: { border: "1px solid red" } });
                } else {
                  // إذا لم يكن النوع يطابق، يمكنك طباعة رسالة خطأ عامة
                  toast.error('An unexpected error occurred.', { style: { border: "1px solid red" } });
                }
            
            } 

        
      
              finally{

          setLoader(false)
        }

  }

  const renderRegisterForm=LOGIN_FORM.map(({name,placeholder,type} ,index )=>{

    return <div key={index} >

          <Input type={type} placeholder={placeholder} {...register(name )} />
          {errors[name]&&<InputErrorMsg msg={errors[name]?.message} /> }

        </div>


})


  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
     {renderRegisterForm}

     <Button fullWidth className="bg-indigo-600 " isLoading={loader} >
         
         Login


  </Button>      </form>
    </div>
  );
};

export default LoginPage;
