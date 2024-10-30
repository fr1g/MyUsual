// See https://aka.ms/new-console-template for more information

Console.WriteLine("\nHello, World!");
Thread.Sleep(100);
Console.WriteLine("the formula is: SUM of foreach ((Numeration ^ [total digits - nth digit from left]) * [nth digit from left]");
while (true)
{
    // to convert over-10x-types should contain each letter and numbers into a sealed items to count.
    Console.WriteLine("To convert from others(less than 10x) back to 10x, keep by Format: <NumerationType>, <ToBeSolved>; input only \"0\" to exit.");
    string? input = Console.ReadLine();
    if(input is null) continue;
    if (input == "0") break;
    var inputSet = input.Replace(" ", "").Split(",");
    long length = inputSet[1].Length - 1;
    long result = 0;
    Console.Write(" => ~ :");
    Thread.Sleep(100);
    foreach (var ic in inputSet[1].ToCharArray())
    {
        Thread.Sleep(100);
        var piece = (long)(Math.Pow(int.Parse(inputSet[0]), length));
        result += piece * long.Parse($"{ic}");
        Console.Write($"[({long.Parse(inputSet[0])} ^ {length}) * {ic}] + ");
        length--;
    }
    Thread.Sleep(100);
    Console.Write(" 0 [end of line] ... ;");
    Thread.Sleep(300);
    Console.WriteLine($"\n => Base 0 index result: {result}; ");
    Thread.Sleep(300);
    Console.WriteLine($" => Base 1 index result: {++result}; ");
    Thread.Sleep(100);
    Console.WriteLine($"\n // BASE0 is for real value");
    Console.WriteLine($" // BASE1 is for those questions that need to seek for the nth index equals to PYKA or sth else,\n // ...since those indexes are starting from 1 while number starts from 0 actually. \n");
    Thread.Sleep(500);

}
Thread.Sleep(100);
Console.WriteLine("\nBye! ");
return;
//