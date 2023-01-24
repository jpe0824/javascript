function main() {
    const args = process.argv.slice(2)
    const nums = args.map(Number);
    let result = 0;
    nums.forEach(num => result += num);
    console.log(result);
}
main()