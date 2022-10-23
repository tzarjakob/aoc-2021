defmodule SecondPart do
  import Packet
  use Application

  def eval(list, num) do
    if Enum.count(list) < num do
      {:end, []}
    else
      {val, r_list} = Enum.split(list, num)
      parsed_val = List.to_string(val) |> Integer.parse(2) |> elem(0)
      {parsed_val, r_list}
    end
  end

  def operator_type(val) do
    case val do
      0 -> :sum
      1 -> :product
      2 -> :minimum
      3 -> :maximum
      5 -> :greater
      6 -> :less
      7 -> :equal_to
    end
  end

  def eval_lit_value(list, prec, times) do
    {parsed_val, r_list} = eval(list, 5)

    cond do
      parsed_val < 16 -> {r_list, prec * 16 + parsed_val, times + 1}
      true -> eval_lit_value(r_list, prec * 16 + (parsed_val - 16), times + 1)
    end
  end

  def parse_subpackets_len(list, sub_len) when sub_len == 0 do
    [] ++ [list]
  end

  def parse_subpackets_len(list, sub_len) do
    if Enum.all?(list, fn elem -> elem == "0" end) or sub_len <= 7 do
      raise("not a proper termination")
      [] ++ [list]
    else
      {packet, r_list} = parse_packet(list)
      [packet] ++ parse_subpackets_len(r_list, sub_len - packet.pl)
    end
  end

  def parse_n_subpackets(list, sub_num) when sub_num > 0 do
    {packet, r_list} = parse_packet(list)
    [packet] ++ parse_n_subpackets(r_list, sub_num - 1)
  end

  def parse_n_subpackets(list, sub_num) when sub_num == 0 do
    [] ++ [list]
  end

  def parse_subpackets(list) do
    {len_id, list} = eval(list, 1)

    cond do
      len_id == 0 ->
        # next 15 bits -> subpacket length
        {sub_len, list} = eval(list, 15)
        res = parse_subpackets_len(list, sub_len) |> Enum.reverse()
        {hd(res), Enum.reverse(tl(res)), 16}

      len_id == 1 ->
        # next 11 bits -> subpacket number
        {sub_num, list} = eval(list, 11)
        res = parse_n_subpackets(list, sub_num) |> Enum.reverse()
        {hd(res), Enum.reverse(tl(res)), 12}
    end
  end

  def apply_operator(packets, operator) do
    case operator do
      :sum ->
        IO.puts("SUM")

        Enum.map(packets, fn p -> p.val end)
        |> IO.inspect(limit: :infinity)
        |> Enum.sum()
        |> IO.inspect()

      :product ->
        IO.puts("PRODUCT")

        Enum.map(packets, fn p -> p.val end)
        |> IO.inspect(limit: :infinity)
        |> Enum.product()
        |> IO.inspect()

      :minimum ->
        IO.puts("MIN")

        Enum.map(packets, fn p -> p.val end)
        |> IO.inspect(limit: :infinity)
        |> Enum.min()
        |> IO.inspect()

      :maximum ->
        IO.puts("MAX")

        Enum.map(packets, fn p -> p.val end)
        |> IO.inspect(limit: :infinity)
        |> Enum.max()
        |> IO.inspect()

      :greater ->
        IO.puts("GREATER")
        IO.inspect(packets, limit: :infinity)

        if Enum.at(packets, 0).val > Enum.at(packets, 1).val do
          1
        else
          0
        end

      :less ->
        IO.puts("LESS")
        IO.inspect(packets, limit: :infinity)

        if Enum.at(packets, 0).val < Enum.at(packets, 1).val do
          1
        else
          0
        end

      :equal_to ->
        IO.puts("EQUAL")
        IO.inspect(packets, limit: :infinity)

        if Enum.at(packets, 0).val == Enum.at(packets, 1).val do
          1
        else
          0
        end
    end
  end

  def eval_packets(packets, operator, used_bits) do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    res = apply_operator(tl(packets), operator)
    %Packet{ver: version_sum, val: res, pl: packet_len + used_bits}
  end

  def parse_packet(list) do
    {version, list} = eval(list, 3)
    {type_id, list} = eval(list, 3)

    cond do
      type_id == 4 ->
        {list, lit_value, times} = eval_lit_value(list, 0, 0)
        packet_len = 6 + times * 5
        IO.puts("literal value = #{lit_value}")
        {%Packet{ver: version, val: lit_value, pl: packet_len}, list}

      true ->
        IO.puts("version = #{version}, type_id = #{type_id}, len = 6")
        {r_list, subpacks, used_bits} = parse_subpackets(list)

        res =
          eval_packets(
            [%Packet{ver: version, val: operator_type(type_id), pl: 6}] ++ subpacks,
            operator_type(type_id),
            used_bits
          )

        {res, r_list}
    end
  end

  def main(data) do
    input_string =
      elem(Integer.parse(data, 16), 0)
      |> Integer.to_string(2)
      |> String.pad_leading(String.length(data) * 4, "0")
      |> String.graphemes()

    parse_packet(input_string) |> IO.inspect()
  end

  def start(_type, _args) do
    data =
      "805311100469800804A3E488ACC0B10055D8009548874F65665AD42F60073E7338E7E5C538D820114AEA1A19927797976F8F43CD7354D66747B3005B401397C6CBA2FCEEE7AACDECC017938B3F802E000854488F70FC401F8BD09E199005B3600BCBFEEE12FFBB84FC8466B515E92B79B1003C797AEBAF53917E99FF2E953D0D284359CA0CB80193D12B3005B4017968D77EB224B46BBF591E7BEBD2FA00100622B4ED64773D0CF7816600B68020000874718E715C0010D8AF1E61CC946FB99FC2C20098275EBC0109FA14CAEDC20EB8033389531AAB14C72162492DE33AE0118012C05EEB801C0054F880102007A01192C040E100ED20035DA8018402BE20099A0020CB801AE0049801E800DD10021E4002DC7D30046C0160004323E42C8EA200DC5A87D06250C50015097FB2CFC93A101006F532EB600849634912799EF7BF609270D0802B59876F004246941091A5040402C9BD4DF654967BFDE4A6432769CED4EC3C4F04C000A895B8E98013246A6016CB3CCC94C9144A03CFAB9002033E7B24A24016DD802933AFAE48EAA3335A632013BC401D8850863A8803D1C61447A00042E3647B83F313674009E6533E158C3351F94C9902803D35C869865D564690103004E74CB001F39BEFFAAD37DFF558C012D005A5A9E851D25F76DD88A5F4BC600ACB6E1322B004E5FE1F2FF0E3005EC017969EB7AE4D1A53D07B918C0B1802F088B2C810326215CCBB6BC140C0149EE87780233E0D298C33B008C52763C9C94BF8DC886504E1ECD4E75C7E4EA00284180371362C44320043E2EC258F24008747785D10C001039F80644F201217401500043A2244B8D200085C3F8690BA78F08018394079A7A996D200806647A49E249C675C0802609D66B004658BA7F1562500366279CCBEB2600ACCA6D802C00085C658BD1DC401A8EB136100"

    SecondPart.main(data)
    Task.start(fn -> nil end)
  end
end
