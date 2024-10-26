import React, { createContext, useState,useEffect } from 'react';


const  MyContext = createContext();


export const Context=({children})=>{
    
    const [token,settoken]=useState(null)
    const [username,addusername]=useState(null)
   
    
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        console.log(storedToken,"here from context")
        if (storedToken) {
            
            settoken(storedToken);
        }
       // Set loading to false once token retrieval is done
    }, [token]); 
   
    const addToken = (newToken) => {
        console.log(newToken)
        console.log("Setting token in local storage:", newToken);
        localStorage.setItem("token", newToken);
        settoken(newToken);
    };

   
    const logout = ()=>{
        localStorage.removeItem("token");
        settoken(null);
       
       }
    


  return (
    <MyContext.Provider value={{token,addToken,addusername,logout}}>
        {children}
    </MyContext.Provider>
  )
}
export const useMyContext = () => React.useContext(MyContext);


