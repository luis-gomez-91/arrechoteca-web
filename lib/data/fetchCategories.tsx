export async function fetchCategories(){
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}categories`)
    const json = await response.json()
    return json
}

