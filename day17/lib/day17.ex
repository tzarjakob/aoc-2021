defmodule Point do
  defstruct x: 0, y: 0
end

defmodule Square do
  defstruct top_left: %Point{}, bottom_right: %Point{}
end

defmodule Day17 do
  def write_color(color, file, scale) do
    Enum.each(1..scale, fn _x ->
      IO.binwrite(file, "#{elem(color, 0)} #{elem(color, 1)} #{elem(color, 2)} ")
    end)
  end

  def write_ppm_file(square, steps, scale \\ 1) do
    the_x = 300
    the_y = 300
    ppm_incipit = "P3\n#{the_x * scale} #{the_y * 2 * scale} \n255"
    {:ok, file} = File.open('./output.ppm', [:write])
    IO.puts(file, ppm_incipit)
    color_red = {255, 0, 0}
    color_white = {255, 255, 255}
    color_black = {0, 0, 0}

    Enum.each(the_y..-the_y, fn y ->
      Enum.each(0..scale-1, fn _s ->
        Enum.each(0..the_x-1, fn x ->
          cp = %Point{x: x, y: y}
          cond do
            is_in_square(cp, square) -> write_color(color_red, file, scale)
            Enum.member?(steps, cp) -> write_color(color_black, file, scale)
            true -> write_color(color_white, file, scale)
          end
        end)
      end)
      IO.write(file, "\n")
    end)
    IO.write(file, "\n")
    File.close(file)
  end

  def input do
    %Square{top_left: %Point{x: 57, y: -147}, bottom_right: %Point{x: 116, y: -198}}
  end

  def example do
    %Square{top_left: %Point{x: 20, y: -5}, bottom_right: %Point{x: 30, y: -10}}
  end

  def is_in_square(point, square) do
    if point.x < square.bottom_right.x and point.x > square.top_left.x and
         point.y < square.top_left.y and point.y > square.bottom_right.y do
      true
    else
      false
    end
  end

  def part_one() do
    write_ppm_file(input(), [])
  end
end

Day17.part_one()
