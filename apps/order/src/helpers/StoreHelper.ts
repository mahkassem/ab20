export default async function verifyStore(storeId: number) {
  try {
    const response = await fetch(`http://localhost:3001/stores/${storeId}`);
    const json = await response.text();
    console.log(json);
    return response.ok;
  } catch (error) {
    console.log(error);
  }
}
