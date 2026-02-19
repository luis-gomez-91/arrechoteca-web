export async function fetchWords(){
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}words`)
    const json = await response.json()
    return json
}

