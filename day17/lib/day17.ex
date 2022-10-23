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
    # target area: x=20..30, y=-10..-5
    %Square{top_left: %Point{x: 20, y: -5}, bottom_right: %Point{x: 30, y: -10}}
  end

  def compute_dx(x, nsteps) when nsteps > x do
    compute_dx(x, x)
  end

  def compute_dx(x, nsteps)do
    #nsteps = nsteps - 1
    (2*x - (nsteps - 1)) * ((nsteps) / 2)
  end

  def compute_dy(y, nsteps) do
    #nsteps = nsteps - 1
    (2*y - (nsteps - 1)) * ((nsteps) / 2)
  end

  def find_min_xval(x_min) do
    # x_min = compute_dx(x, x-1) = (x + 1) * (x / 2)
    :math.ceil((-1 + :math.sqrt(8 * x_min)) / 2)
  end

  def is_in_square(point, square) do
    if point.x < square.bottom_right.x and point.x > square.top_left.x and
         point.y < square.top_left.y and point.y > square.bottom_right.y do
      true
    else
      false
    end
  end

  def find_max_high(y) when y < 0 do 0 end
  def find_max_high(y) do (y + 1) * (y / 2) end

  def analyze_y(square, x_val, steps, y_val, msf) do
    val = compute_dy(y_val, steps)
    cond do
      val > square.top_left.y ->
        # y too high
        msf
      val < square.bottom_right.y ->
        # too far
        analyze_y(square, x_val, steps, y_val + 1, msf)
      true ->
        res = Enum.max([find_max_high(y_val), msf])
        IO.puts("SOLUTION FOUND x= #{x_val}, y= #{y_val}, steps= #{steps}, oldmsf= #{msf}, res = #{res}, x_res = #{compute_dx(x_val, steps)}, y_res = #{compute_dy(y_val, steps)}, x_r = #{square.top_left.x} #{square.bottom_right.x}, y_r = #{square.top_left.y} #{square.bottom_right.y}")
        analyze_y(square, x_val, steps, y_val + 1, res)
    end
  end

  # def analyze_x_with_steps(_square, x_val, steps, msf) when steps > x_val do msf end

  def analyze_x_with_steps(square, x_val, steps, msf) do
    val = compute_dx(x_val, steps)
    cond do
      val < square.top_left.x ->
        # too few steps
        analyze_x_with_steps(square, x_val, steps + 1, msf)
      val > square.bottom_right.x ->
        # gone too far
        msf
      true ->
        # search for an appropriate y
        initial_y_val = -20 # TODO
        new_msf = analyze_y(square, x_val, steps, initial_y_val, msf)
        analyze_x_with_steps(square, x_val, steps + 1, new_msf)
    end
  end

  def analyze_x(square, x_val, msf) when square.bottom_right.x > x_val do
    init_step = 1 # trivial solution
    msf = analyze_x_with_steps(square, x_val, init_step, msf)
    analyze_x(square, x_val + 1, msf)
  end

  def analyze_x(_square, _x_val, msf) do msf end

  def part_one(square) do
    # write_ppm_file(square, [])
    initial_x_val = 0 # find_min_xval(square.top_left.x)
    IO.inspect(square)
    msf = analyze_x(square, initial_x_val, 0)
    IO.puts(msf)
  end

  def start(_type, _args) do
    part_one(example())
    # part_one(input())
    Task.start(fn -> nil end)
  end
end
