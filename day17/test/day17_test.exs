defmodule Day17Test do
  use ExUnit.Case
  doctest Day17

  test "check every resulted tuple" do
    square = Day17.input()
    res = Day17.part_two(square)
    x_max = square.bottom_right.x
    x_min = square.top_left.x
    y_min = square.bottom_right.y
    y_max = square.top_left.y

    Enum.each(res, fn {x, y, steps} ->
      x_val = Day17.compute_dx(x, steps)
      y_val = Day17.compute_dy(y, steps)
      assert(x_min <= x_val and x_val <= x_max and y_min <= y_val and y_val <= y_max)
    end)
  end
end
