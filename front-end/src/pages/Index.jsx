import Header from "../components/Header";
import Card from "../components/Card";

const Index = () => {

    const users = [
      {
        "nome": "Luana",
        "habilidades_oferecidas": [
          "Violão",
          "Programação",
          "React",
          "HTML",
          "CSS",
          "Java",
          "PHP",
          "Python",
        ],
        "habilidades_procuradas": [
          "Inglês",
          "Cálculo I",
        ]
      },
      {
        "nome": "Pedro",
        "habilidades_oferecidas": [
          "Violão",
          "Cálculo I",
          "Inglês",
        ],
        "habilidades_procuradas": [
          "React",
          "Java",
        ]
      },
    ]

    return  <div className='bg-light-purple min-h-screen h-full'>
      <Header />
      <main className='flex-1 h-full'>
        <div className='grid grid-cols-3 max-w-325 m-auto'>
          {users.map((user, index) => 
            <Card 
              key={index} 
              name={user.nome} 
              habilidades_oferecidas={user.habilidades_oferecidas}
              habilidades_procuradas={user.habilidades_procuradas}
            />)
            }
        </div>
      </main>
    </div>
};

export default Index;