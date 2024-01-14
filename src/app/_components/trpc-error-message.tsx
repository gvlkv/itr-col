export default function trpcErrorMessage(messageJson: string) {
  const messages = JSON.parse(messageJson) as [
    { message: string; path: string[] },
  ];
  return (
    <>
      {messages.map((message, i) => (
        <p key={i}>
          <strong>{message?.path}:</strong> {message?.message}
        </p>
      ))}
    </>
  );
}
