export async function fetchBadWords(){
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}bad_words`)
    const json = await response.json()
    return json
}

