const VerifyEmailPage = () => {
  return (
    <div className="flex flex-col w-full max-w-sm gap-12 p-4 mx-auto bg-white border rounded shadow-sm border-brand-background">
      <header className="text-center">
        <h1 className="mb-2 text-lg font-medium">Revisa tu correo</h1>

        <p className="w-10/12 mx-auto mb-2 text-sm leading-4">
          Te enviamos un link de acceso. Da click en el link para entrar a Sicaru.
        </p>
      </header>
    </div>
  );
};

export default VerifyEmailPage;
