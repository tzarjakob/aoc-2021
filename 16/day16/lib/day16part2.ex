defmodule SecondPart do
  import Packet
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

  def eval_packets(packets, operator, used_bits) when operator == :sum do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packets = tl(packets)
    val_sum = Enum.map(packets, fn packet -> packet.val end) |> Enum.sum()
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    %Packet{ver: version_sum, val: val_sum, pl: packet_len + used_bits}
  end

  def eval_packets(packets, operator, used_bits) when operator == :product do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packets = tl(packets)
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    res = Enum.map(packets, fn packet -> packet.val end) |> Enum.product()
    %Packet{ver: version_sum, val: res, pl: packet_len + used_bits}
  end

  def eval_packets(packets, operator, used_bits) when operator == :minimum do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packets = tl(packets)
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    res = Enum.map(packets, fn packet -> packet.val end) |> Enum.min()
    %Packet{ver: version_sum, val: res, pl: packet_len + used_bits}
  end

  def eval_packets(packets, operator, used_bits) when operator == :maximum do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packets = tl(packets)
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    res = Enum.map(packets, fn packet -> packet.val end) |> Enum.max()
    %Packet{ver: version_sum, val: res, pl: packet_len + used_bits}
  end

  def eval_packets(packets, operator, used_bits) when operator == :greater do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packets = tl(packets)
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    first = Enum.at(packets, 0)
    second = Enum.at(packets, 1)

    if first.val > second.val do
      %Packet{ver: version_sum, val: 1, pl: packet_len + used_bits}
    else
      %Packet{ver: version_sum, val: 0, pl: packet_len + used_bits}
    end
  end

  def eval_packets(packets, operator, used_bits) when operator == :less_than do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packets = tl(packets)
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    first = Enum.at(packets, 0)
    second = Enum.at(packets, 1)

    if first.val < second.val do
      %Packet{ver: version_sum, val: 1, pl: packet_len + used_bits}
    else
      %Packet{ver: version_sum, val: 0, pl: packet_len + used_bits}
    end
  end

  def eval_packets(packets, operator, used_bits) when operator == :equal_to do
    version_sum = Enum.map(packets, fn packet -> packet.ver end) |> Enum.sum()
    packets = tl(packets)
    packet_len = Enum.map(packets, fn packet -> packet.pl end) |> Enum.sum()
    first = Enum.at(packets, 0)
    second = Enum.at(packets, 1)

    if first.val == second.val do
      %Packet{ver: version_sum, val: 1, pl: packet_len + used_bits}
    else
      %Packet{ver: version_sum, val: 0, pl: packet_len + used_bits}
    end
  end

  def eval_operator_type(op_type) do
    case op_type do
      0 -> :sum
      1 -> :product
      2 -> :minimum
      3 -> :maximum
      5 -> :greater
      6 -> :less_than
      7 -> :equal_to
    end
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
        {r_list, subpacks, used_bits} = parse_subpackets(list)
        res = eval_packets([%Packet{ver: version, val: :tumare, pl: 6}] ++ subpacks, eval_operator_type(type_id), used_bits)
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
