import Header from "../components/Header";
import Card from "../components/Card";

const Index = () => {

    const users = [
    {
        "id": 1,
        "email": "teste@gmail.com",
        "url_img": null,
        "username": "teste",
        "password": "12345",
        "skills": [
            {
                "id": 1,
                "name": "Piano",
                "description": "teste",
                "type": "offered",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            },
            {
                "id": 1,
                "name": "Guitarra",
                "description": "teste",
                "type": "offered",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            },
            {
                "id": 1,
                "name": "Inglês",
                "description": "teste",
                "type": "sought",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            }
        ]
    },
    {
        "id": 1,
        "email": "teste@gmail.com",
        "url_img": null,
        "username": "teste",
        "password": "12345",
        "skills": [
            {
                "id": 1,
                "name": "Piano",
                "description": "teste",
                "type": "offered",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            },
            {
                "id": 1,
                "name": "Guitarra",
                "description": "teste",
                "type": "offered",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            },
            {
                "id": 1,
                "name": "Inglês",
                "description": "teste",
                "type": "sought",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            }
        ]
    },
    {
        "id": 1,
        "email": "teste@gmail.com",
        "url_img": null,
        "username": "teste",
        "password": "12345",
        "skills": [
            {
                "id": 1,
                "name": "Piano",
                "description": "teste",
                "type": "offered",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            },
            {
                "id": 1,
                "name": "Guitarra",
                "description": "teste",
                "type": "offered",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            },
            {
                "id": 1,
                "name": "Inglês",
                "description": "teste",
                "type": "sought",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            }
        ]
    }
]

    return  <div className='bg-light-purple min-h-screen h-full'>
      <Header />
      <main className='flex-1 h-full'>
        <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-w-325 m-auto'>
          {users.map((user) => 
            <Card 
              key={user.id} 
              name={user.username} 
              habilidades_oferecidas={user.skills.filter((skill) => skill.type === "offered")}
              habilidades_procuradas={user.skills.filter((skill) => skill.type === "sought")}
            />)
            }
        </div>
      </main>
    </div>
};

export default Index;