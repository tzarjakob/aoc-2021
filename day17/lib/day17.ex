defmodule Day17 do
  def input do
    {57, 116, -198, -147}
  end

  def example do
    {20, 30, -10, -5}
  end

  def compute_dx(x, nsteps) when nsteps > x do
    compute_dx(x, x)
  end

  def compute_dx(x, nsteps) do
    (2 * x - (nsteps - 1)) * (nsteps / 2)
  end

  def compute_dy(y, nsteps) do
    (2 * y - (nsteps - 1)) * (nsteps / 2)
  end

  def test_values(x, y, x_max, x_min, y_max, y_min, steps) do
    x_val = compute_dx(x, steps)
    y_val = compute_dy(y, steps)

    cond do
      x_val > x_max or y_val < y_min ->
        []

      x_min <= x_val and x_val <= x_max and y_min <= y_val and y_val <= y_max ->
        [{x, y, steps}] ++ test_values(x, y, x_max, x_min, y_max, y_min, steps + 1)

      true ->
        test_values(x, y, x_max, x_min, y_max, y_min, steps + 1)
    end
  end

  def test_ys(x, y, x_max, x_min, y_max, y_min) when y >= y_min do
    test_values(x, y, x_max, x_min, y_max, y_min, 0) ++
      test_ys(x, y - 1, x_max, x_min, y_max, y_min)
  end

  def test_ys(_x, _y, _x_max, _x_min, _y_max, _y_min) do
    []
  end

  def test_xs(x, x_max, x_min, y_max, y_min) when x <= x_max do
    test_ys(x, -y_min, x_max, x_min, y_max, y_min) ++ test_xs(x + 1, x_max, x_min, y_max, y_min)
  end

  def test_xs(_x, _x_max, _x_min, _y_max, _y_min) do
    []
  end

  def part_two(square) do
    {x_min, x_max, y_min, y_max} = square
    min_x_val = :math.ceil((-1 + :math.sqrt(8 * x_min)) / 2) |> trunc()
    test_xs(min_x_val, x_max, x_min, y_max, y_min)
  end

  def find_max_high(y) when y < 0 do
    0
  end

  def find_max_high(y) do
    (y + 1) * (y / 2)
  end

  def part_one(square) do
    {_x_min, _x_max, _y_min, y_max} = square
    find_max_high(abs(y_max) - 1)
  end

  def start(_type, _args) do
    part_one(input()) |> IO.inspect()

    res =
      part_two(input())
      |> Enum.reject(&is_nil/1)
      |> Enum.map(fn {x, y, _steps} -> {x, y} end)
      |> Enum.uniq()
      |> IO.inspect(limit: :infinity)

    IO.puts(length(res))

    Task.start(fn -> nil end)
  end
end
