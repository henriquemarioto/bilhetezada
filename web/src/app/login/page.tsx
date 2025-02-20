import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <article>
      <div>
        <section>
          <p>Bilhetezada</p>
        </section>
        <section>
          <h1>Login</h1>
          <h2>Gerencie seus eventos com Bilhetezada</h2>
        </section>
        <form>
          <div>
            <label>Email</label>
            <input type="email" name="email" />
          </div>
          <div>
            <label>Senha</label>
            <input type="password" name="password" />
          </div>
        </form>
        <section>
          <Button>Entrar</Button>
        </section>
      </div>
    </article>
  );
}
