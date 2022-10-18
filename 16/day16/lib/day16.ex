defmodule Day16 do
  def eval(list, num) do
    {val, r_list} = Enum.split(list, num)
    parsed_val = List.to_string(val) |> Integer.parse(2) |> elem(0)
    {parsed_val, r_list}
  end

  def eval_lit_value(list, prec, times) do
    {parsed_val, r_list} = eval(list, 5)

    cond do
      parsed_val < 16 -> {r_list, parsed_val, times + 1}
      true -> eval_lit_value(r_list, prec * 2 ** 4 + (parsed_val - 16), times + 1)
    end
  end

  def parse_subpackets_len(list, sub_len) when sub_len > 10 do
    # IO.puts(sub_len)
    {val, c_len, r_list} = parse_packet(list) # |> IO.inspect()
    # IO.puts("sub_len - c_len = #{sub_len - c_len}")
    [val] ++ parse_subpackets_len(r_list, sub_len - c_len)
  end

  def parse_subpackets_len(_list, _sub_len) do
    []
  end

  #def parse_subpackets_len(_list, _sub_len) do
  #  IO.puts("vecio, qua non ce la fa a fare un altro pacchetto")
  #  exit(122)
  #end

  def parse_n_subpackets(list, sub_num) when sub_num > 0 do
    {val, _c_len, r_list} = parse_packet(list)
    [val] ++ parse_n_subpackets(r_list, sub_num - 1)
  end

  def parse_n_subpackets(_list, sub_num) when sub_num == 0 do
    []
  end

  def parse_subpackets(list, _operator) do
    {len_id, list} = eval(list, 1)

    cond do
      len_id == 0 ->
        # next 15 bits -> subpacket length
        {sub_len, list} = eval(list, 15)
        parse_subpackets_len(list, sub_len)

      len_id == 1 ->
        # next 11 bits -> subpacket number
        {sub_num, list} = eval(list, 11)
        parse_n_subpackets(list, sub_num)
    end
  end

  def parse_packet(list) do
    {version, list} = eval(list, 3)
    {type_id, list} = eval(list, 3)
    IO.puts("version = #{version}, type_id = #{type_id}")

    cond do
      type_id == 4 ->
        {list, lit_value, times} = eval_lit_value(list, 0, 0)
        {%{version: version, value: lit_value}, 6 + times * 5, list}

      true ->
        subpacks = parse_subpackets(list, :tumare) # |> IO.inspect()


        # subpacks_version_sum = subpacks |> Enum.map(fn val -> val.version end) |> Enum.sum()
        # IO.puts("subpacks_version_sum = #{subpacks_version_sum}")
        # as value you should return using the specific operator
        {%{version: 0, value: 1}, 6, list}
    end
  end

  def day16_solution() do
    # data = File.read!('./input.txt')
    # data = "8A004A801A8002F478"
    data = "620080001611562C8802118E34"

    input_string =
      elem(Integer.parse(data, 16), 0)
      |> Integer.to_string(2)
      |> String.pad_leading(String.length(data) * 4, "0")
      |> String.graphemes()

    {val, len, list} = parse_packet(input_string)
    IO.inspect({val, len, list})
  end
end
