export const sendEmail = async (to: string, subject: string, message: string) => {
  console.log("📩 Sending Email...");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Message:", message);

  return true;
};