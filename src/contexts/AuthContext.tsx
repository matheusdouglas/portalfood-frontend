import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
};

type SignInProps = {
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

// o que eu quero que retorne pra mim

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {


  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch {
    console.log("erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user; // vai converter a variavel do user em bolle



  useEffect(() => {
    // tentar pegar algo no cokkie que eo token
    const { "@nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { id, name, email,is_admin } = response.data;

          setUser({
            id,
            name,
            email,
            is_admin
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", {
        email,
        password,
      });
  
      if (response.status === 200) {
        // Sucesso: o usuário foi autenticado com êxito
        const { id, name, token, is_admin } = response.data;
  
        setCookie(undefined, "@nextauth.token", token, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/", // expira em um mês
        });
  
        setUser({
          id,
          name,
          email,
          is_admin
        });
  
        // passar para próximas requisições nosso token
  
        api.defaults.headers["Authorization"] = `Bearer ${token}`;
  
        toast.success("Logado com sucesso");
  
        if (is_admin) {
          Router.push("/dashboard"); // Redireciona para a rota de administrador
        } else {
          Router.push("/consulta"); // Redireciona para a rota de usuário comum
        }
      } else {
        // O servidor retornou um status inesperado
        toast.error("Erro ao acessar");
      }
    } catch (error) {
      if (error.response) {
        // Erro com resposta do servidor
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
      } else {
        // Erro sem resposta do servidor
        toast.error("Erro ao acessar");
      }
    }
  }
  

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post("/users", {
        name,
        email,
        password,
      });
         
      if(response.status === 200){
        toast.success("Conta criada com sucesso");
        Router.push("/");
      }else {
       toast.error("Erro ao criar conta");
      }

    } catch (error) {
         const errorMessage = error.response.data.error;
         toast.error(errorMessage)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
