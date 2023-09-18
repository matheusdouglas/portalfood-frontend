import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from 'nookies'


// funcao para paginas que so pode ser acessadas por visitantes 

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {


        //precisa passar o contexto por que ta do lado do servidor 
        const cookies = parseCookies(ctx);

        // se o cara tentar acessar a pagina porem tendo  ja um login salvo redirecionamos
        if (cookies['@nextauth.token']) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,


                    // e so para falar que e um boleano e nao vai acontece para ssempre
                }
            }
        }
        return await fn(ctx)

    }

}