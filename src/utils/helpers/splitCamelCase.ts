function splitCamelCase(input: string): string {
    const spaced = input.replace(/([a-z])([A-Z])/g, '$1 $2');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default splitCamelCase;