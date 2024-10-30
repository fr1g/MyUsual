// See https://aka.ms/new-console-template for more information

Console.WriteLine("Hello, World!");
string? xxx;
while (true)
{
    Console.WriteLine($"Write each adding separated with comma, and powers using ^. [{Convert.ToString(13, 2)} & {Convert.ToString(-13, 2)}]");
    xxx = Console.ReadLine();
    if(xxx is null or "") continue;
    var partials = xxx.Replace(" ", "").Split(','); // make each split
    (long root, long power)[] divided = new (long root, long power)[partials.Length];
    int count = 0;
    foreach (var item in partials)
    {
        string?[] tmp = item.Split('^');
        divided[count].Item1 = long.Parse(tmp[0]!);
        divided[count].Item2 = long.Parse((tmp.Length == 1) ? "1" : tmp[1] !);
        count++;
    }
    var resultSet = new long[partials.Length];
    count = 0;
    Console.WriteLine("Recognized Expression: ");
    foreach (var single in divided)
    {
        Console.Write(single.power == 1 ? $"({single.root}) + " : $"({single.root} ^ {single.power}) + ");
        resultSet[count] = (long)(Math.Pow(single.root, single.power));
        count++;
    }
    Console.Write("0 =>> ...\n");
    long x = 0;
    foreach (var lognee in resultSet)
    {
        Console.WriteLine($"{Convert.ToString(lognee, 2)} + ");
        x += lognee;
    }

    string xx = Convert.ToString(x, 2);
    int odins = 0;
    Console.WriteLine($"0 ==== {xx} ({x})");
    foreach (var ch in xx)
    {
        if (ch == '1') odins++;
    }
    
    Console.WriteLine($"\n{odins}");
    

}