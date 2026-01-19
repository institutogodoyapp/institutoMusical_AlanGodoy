import { httpClient } from "@/app/http";
import { Disciplina, DisciplinaCadastro } from "@/app/models/escola/instrumentos/conteudoProgramatico/disciplina";
import { ConteudoProgramatico } from "@/app/models/escola/instrumentos/conteudoProgramatico";
import { AxiosResponse } from "axios";
import { Topico, TopicoCadastro } from "@/app/models/escola/instrumentos/conteudoProgramatico/topico";
import { Documento } from "@/app/models/escola/instrumentos/conteudoProgramatico/documento";
import { authService } from "../../api/authSeervice";

const resourceURL: string = '/admin/escola-musica/conteudo-programatico';
const url = process.env.NEXT_PUBLIC_INSTITUTOMUSICAL_GODOY_APP

export const useDocsService = () => {

    const verDoc = async (docId: number): Promise<Number> => {
        const response: AxiosResponse<Number> =
            await httpClient.get(`${resourceURL}/documentos/${docId}`);
        return response.data;
    };

    const deletarArquivo = async (docId: number): Promise<void> => {

        await httpClient.delete(`${resourceURL}/documentos/${docId}`);

    };

    const upload = async (file: File, topicoId: number): Promise<Documento> => {
        const formData = new FormData()
        formData.append('file', file)

        const token = authService.getTokens() // seu storage
        const tokenDefinido = token.refreshToken
        if (!token) throw new Error('Token não encontrado - faça login');
       

        const response = await fetch(
            `${url}${resourceURL}/topicos/${topicoId}/documentos`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `${tokenDefinido}`,  // ← ADICIONE
                    'Accept': 'application/json, text/plain, */*'   // força binário
                }

            }
        );

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }


    return {
        verDoc,
        upload,


        deletarArquivo

    }
}