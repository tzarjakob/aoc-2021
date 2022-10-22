defmodule Packet do
  defstruct ver: 0, val: 0, pl: 0, max: 0, min: 0
end

defmodule Day16 do
  def eval(list, num) do
    if Enum.count(list) < num do
      {:end, []}
    else
      {val, r_list} = Enum.split(list, num)
      parsed_val = List.to_string(val) |> Integer.parse(2) |> elem(0)
      {parsed_val, r_list}
    end
  end

  def eval_lit_value(list, prec, times) do
    {parsed_val, r_list} = eval(list, 5)

    cond do
      parsed_val < 16 -> {r_list, prec * 16 + parsed_val, times + 1}
      true -> eval_lit_value(r_list, prec * 16 + (parsed_val - 16), times + 1)
    end
  end

  def parse_subpackets_len(list, sub_len) do
    if Enum.all?(list, fn elem -> elem == "0" end) or sub_len == 0 do
      [] ++ [list]
    else
      IO.puts("sublen = #{sub_len}")
      # |> IO.inspect()
      {packet, r_list} = parse_packet(list)
      IO.puts("sublen = #{sub_len} | #{sub_len - packet.pl}")
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

  def parse_subpackets(list, _operator) do
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

  def eval_packets(packets, operator, used_bits) when operator == :tumare do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    %Packet{ver: version_sum, val: -1, pl: packet_len + used_bits}
  end

  def parse_packet(list) do
    {version, list} = eval(list, 3)
    {type_id, list} = eval(list, 3)

    cond do
      type_id == 4 ->
        {list, lit_value, times} = eval_lit_value(list, 0, 0)
        packet_len = 6 + times * 5
        {%Packet{ver: version, val: lit_value, pl: packet_len}, list}

      true ->
        IO.puts("version = #{version}, type_id = #{type_id}, len = 6")
        {r_list, subpacks, used_bits} = parse_subpackets(list, :tumare)

        res =
          eval_packets(
            [%Packet{ver: version, val: :tumare, pl: 6}] ++ subpacks,
            :tumare,
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
end
