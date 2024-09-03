import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Serviço | FSW Barber",
  description: "Termos de Serviço da FSW Barber",
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Termos de Serviço</h1>
      <div className="space-y-4">
        <p>
          Ao acessar ao site FSW Barber, concorda em cumprir estes termos de
          serviço, todas as leis e regulamentos aplicáveis e concorda que é
          responsável pelo cumprimento de todas as leis locais aplicáveis. Se
          você não concordar com algum desses termos, está proibido de usar ou
          acessar este site. Os materiais contidos neste site são protegidos
          pelas leis de direitos autorais e marcas comerciais aplicáveis.
        </p>
        <h2 className="mt-4 text-xl font-semibold">1. Uso de Licença</h2>
        <p>
          É concedida permissão para baixar temporariamente uma cópia dos
          materiais (informações ou software) no site FSW Barber, apenas para
          visualização transitória pessoal e não comercial. Esta é a concessão
          de uma licença, não uma transferência de título e, sob esta licença,
          você não pode:
        </p>
        <ul className="list-disc pl-5">
          <li>modificar ou copiar os materiais;</li>
          <li>
            usar os materiais para qualquer finalidade comercial ou para
            exibição pública (comercial ou não comercial);
          </li>
          <li>
            tentar descompilar ou fazer engenharia reversa de qualquer software
            contido no site FSW Barber;
          </li>
          <li>
            remover quaisquer direitos autorais ou outras notações de
            propriedade dos materiais; ou
          </li>
          <li>
            transferir os materiais para outra pessoa ou &apos;espelhar&apos; os
            materiais em qualquer outro servidor.
          </li>
        </ul>
        <p>
          Esta licença será automaticamente rescindida se você violar alguma
          dessas restrições e poderá ser rescindida por FSW Barber a qualquer
          momento. Ao encerrar a visualização desses materiais ou após o término
          desta licença, você deve apagar todos os materiais baixados em sua
          posse, seja em formato eletrônico ou impresso.
        </p>
        <h2 className="mt-4 text-xl font-semibold">
          2. Isenção de responsabilidade
        </h2>
        <p>
          Os materiais no site da FSW Barber são fornecidos &apos;como
          estão&apos;. FSW Barber não oferece garantias, expressas ou
          implícitas, e, por este meio, isenta e nega todas as outras garantias,
          incluindo, sem limitação, garantias implícitas ou condições de
          comercialização, adequação a um fim específico ou não violação de
          propriedade intelectual ou outra violação de direitos.
        </p>
        <p>
          Além disso, o FSW Barber não garante ou faz qualquer representação
          relativa à precisão, aos resultados prováveis ou à confiabilidade do
          uso dos materiais em seu site ou de outra forma relacionado a tais
          materiais ou em sites vinculados a este site.
        </p>
        <h2 className="mt-4 text-xl font-semibold">3. Limitações</h2>
        <p>
          Em nenhum caso o FSW Barber ou seus fornecedores serão responsáveis
          por quaisquer danos (incluindo, sem limitação, danos por perda de
          dados ou lucro ou devido a interrupção dos negócios) decorrentes do
          uso ou da incapacidade de usar os materiais em FSW Barber, mesmo que
          FSW Barber ou um representante autorizado da FSW Barber tenha sido
          notificado oralmente ou por escrito da possibilidade de tais danos.
          Como algumas jurisdições não permitem limitações em garantias
          implícitas, ou limitações de responsabilidade por danos conseqüentes
          ou incidentais, essas limitações podem não se aplicar a você.
        </p>
        <h2 className="mt-4 text-xl font-semibold">
          4. Precisão dos materiais
        </h2>
        <p>
          Os materiais exibidos no site da FSW Barber podem incluir erros
          técnicos, tipográficos ou fotográficos. FSW Barber não garante que
          qualquer material em seu site seja preciso, completo ou atual. FSW
          Barber pode fazer alterações nos materiais contidos em seu site a
          qualquer momento, sem aviso prévio. No entanto, FSW Barber não se
          compromete a atualizar os materiais.
        </p>
        <h2 className="mt-4 text-xl font-semibold">5. Links</h2>
        <p>
          O FSW Barber não analisou todos os sites vinculados ao seu site e não
          é responsável pelo conteúdo de nenhum site vinculado. A inclusão de
          qualquer link não implica endosso por FSW Barber do site. O uso de
          qualquer site vinculado é por conta e risco do usuário.
        </p>
        <h2 className="mt-4 text-xl font-semibold">6. Modificações</h2>
        <p>
          O FSW Barber pode revisar estes termos de serviço do site a qualquer
          momento, sem aviso prévio. Ao usar este site, você concorda em ficar
          vinculado à versão atual desses termos de serviço.
        </p>
        <h2 className="mt-4 text-xl font-semibold">7. Lei aplicável</h2>
        <p>
          Estes termos e condições são regidos e interpretados de acordo com as
          leis do FSW Barber e você se submete irrevogavelmente à jurisdição
          exclusiva dos tribunais naquele estado ou localidade.
        </p>
      </div>
    </div>
  )
}
