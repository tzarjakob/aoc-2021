#include <fstream>
#include <iostream>
#include <string>
#include <vector>
#include <cstdint>
#include <queue>
#include <limits>
#include <algorithm>
#include <set>

extern "C"
{
#include <assert.h>
}

#define ASS_BOUNDARIES(x, y, dim) assert((x) >= 0 && (y) >= 0 && (x) < (dim) && (y) < (dim));

using std::cin;
using std::cout;
using std::endl;

typedef std::vector<std::vector<int>> matrix_t;

void print_vec(const std::vector<int> &vec)
{
    for (auto &i : vec)
        cout << (int)i << " ";
    cout << "\n";
}

void print_mtx(const matrix_t &mtx)
{
    for (auto &row : mtx)
    {
        print_vec(row);
        cout << "\n";
    }
}

void parseInputFile(std::string filename, matrix_t &mtx, std::vector<int> &vec)
{
    std::ifstream input(filename);
    std::string line;
    while (std::getline(input, line))
    {
        std::vector<int> row;
        for (char c : line)
        {
            row.push_back(c - '0');
            vec.push_back(c - '0');
        }
        mtx.push_back(row);
    }
    assert(!vec.empty() && !mtx.empty());
}

void initGraph(matrix_t &graph, matrix_t &mInput, std::vector<int> &vInput)
{
    int dim = mInput.size();
    for (int ir = 0; ir < dim; ++ir)
    {
        for (int ic = 0; ic < dim; ++ic)
        {
            int ccurr = ir * dim + ic;
            if (ir > 0)
            {
                ASS_BOUNDARIES(ir, ic, dim);
                graph[(ir - 1) * dim + ic].push_back(ccurr);
            }
            if (ir < dim - 1)
            {
                ASS_BOUNDARIES(ir, ic, dim);
                graph[(ir + 1) * dim + ic].push_back(ccurr);
            }
            if (ic > 0)
            {
                ASS_BOUNDARIES(ir, ic, dim);
                graph[ir * dim + (ic - 1)].push_back(ccurr);
            }
            if (ic < dim - 1)
            {
                ASS_BOUNDARIES(ir, ic, dim);
                graph[ir * dim + (ic + 1)].push_back(ccurr);
            }
        }
    }
}

int scaleElement(int prev, int val)
{
    int res = prev + val;
    return res <= 9 ? res : (res % 10) + 1;
}

void scaleInput(matrix_t &bigmInput, std::vector<int> &bigvInput, const matrix_t &mInput, const std::vector<int> &vInput, const int TIMES)
{
    const int dim = mInput.size();
    for (int xtime = 0; xtime < TIMES; ++xtime)
    {
        for (int ytime = 0; ytime < TIMES; ++ytime)
        {
            for (int irow = 0; irow < dim; ++irow)
            {
                for (int icol = 0; icol < dim; ++icol)
                {
                    int sc = scaleElement(mInput[irow][icol], xtime + ytime);
                    int bigx = xtime * dim + irow;
                    int bigy = ytime * dim + icol;
                    bigmInput[bigx][bigy] = sc;
                    bigvInput[bigx * TIMES * dim + bigy] = sc;
                }
            }
        }
    }
}

int minIndex(const std::set<int> &v, const std::vector<int> &dis)
{
    int msf = std::numeric_limits<int>::max();
    int ind = -1;
    for (auto &i : v)
    {
        if (dis[i] < msf)
        {
            msf = dis[i];
            ind = i;
        }
    }
    return ind;
}

class Pnode {
    public:
    int index; int priority;
    Pnode() {}
    Pnode(int _i, int _p) : index(_i), priority(_p) {}
    bool operator< (const Pnode& p) const { return priority < p.priority; }
    bool operator> (const Pnode& p) const { return ! (*this < p);}
    bool operator== (const Pnode& p) const { return index == p.index; }
};

int shortestPathLenghtPriorityQueue(const matrix_t &graph, const std::vector<int> &vInput, int startingPoint)
{
    const int dim = vInput.size();
    const int INF = std::numeric_limits<int>::max();
    std::vector<int> distances(dim, INF);
    distances[startingPoint] = 0;
    std::vector<int> prev(dim, -1);
    std::priority_queue<Pnode, std::vector<Pnode>, std::greater<Pnode>> queue;
     std::vector<bool> inQueue(dim, true);
    for (int i = 0; i < dim; ++i) {
        if (i != startingPoint)
        queue.push(Pnode(i, INF));
    }
    queue.push(Pnode(startingPoint, 0));
    Pnode curr;

    while (!queue.empty())
    {
        int qsize = queue.size();
        cout << "PROGRESS " << (float) ((dim - qsize) * 100.0f) / dim << "% \r";
        curr = queue.top();
        queue.pop();
        int cnode = curr.index;
        inQueue[cnode] = false;
        assert(distances[cnode] != INF);
        for (int iad = 0; iad < graph[cnode].size(); iad++)
        {
            int dest = graph[cnode][iad];
            if (inQueue[dest])
            {
                int alt = distances[cnode] + vInput[dest];
                if (alt < distances[dest] && distances[cnode] != INF)
                {
                    distances[dest] = alt;
                    prev[dest] = cnode;                  
                    queue.push(Pnode(dest, alt));
                }
            }
        }
    }
    cout << "\n";
    return distances[dim - 1];
}

int shortestPathLenght(const matrix_t &graph, const std::vector<int> &vInput, int startingPoint)
{
    const int dim = vInput.size();
    const int INF = std::numeric_limits<int>::max();
    std::vector<int> distances(dim, INF);
    distances[startingPoint] = 0;
    std::vector<int> prev(dim, -1);
    std::set<int> queue;
    for (int i = 0; i < dim; ++i)
        queue.insert(i);

    while (!queue.empty())
    {
        int qsize = queue.size();
        cout << "PROGRESS " << (float) ((dim - qsize) * 100.0f) / dim << "% \r";
        int cnode = minIndex(queue, distances);
        queue.erase(cnode);
        assert(distances[cnode] != INF);
        for (int iad = 0; iad < graph[cnode].size(); iad++)
        {
            int dest = graph[cnode][iad];
            if (queue.find(dest) != queue.end())
            {
                int alt = distances[cnode] + vInput[dest];
                if (alt < distances[dest] && distances[cnode] != INF)
                {
                    distances[dest] = alt;
                    prev[dest] = cnode;
                }
            }
        }
    }
    cout << "\n";
    return distances[dim - 1];
}

void generateGraphViz(const matrix_t &graph, const std::vector<int> &vInput, int rowSize)
{
    std::ofstream fout("./generated.dot");
    fout << "digraph chiton {\n";
    fout << "\tnode [shape=plaintext]\n";

    const int dim = vInput.size();
    for (int i = 0; i < dim; ++i)
    {
        fout << "\t"
             << "\"node_" << i << "\" [label=" << i << "] [shape=plaintext];"
             << "\n";
    }

    fout << "\n\tedge [weight=1000 style=dashed color=dimgrey]\n\n";

    for (int i = 0; i < dim; ++i)
    {
        for (int j = 0; j < graph[i].size(); ++j)
        {
            int cnode = i;
            if (abs(cnode - graph[i][j]) > 1)
            {
                fout << "\tnode_" << cnode << " -> node_" << graph[i][j] << " [label=" << vInput[graph[i][j]] << "];\n";
            }
        }
    }
    fout << "\n";

    for (int i = 0; i < dim; ++i)
    {
        if (i % rowSize == 0)
        {
            fout << "\trank=same {\n";
        }
        for (int j = 0; j < graph[i].size(); ++j)
        {
            int cnode = i;
            if (abs(cnode - graph[i][j]) == 1)
            {
                fout << "\tnode_" << cnode << " -> node_" << graph[i][j] << " [label=" << vInput[graph[i][j]] << "];\n";
            }
        }
        if (i % rowSize == rowSize - 1)
        {
            fout << "\t}\n";
        }
    }
    fout << "\n";

    fout << "}";
    fout.close();
}

int main(int argc, char *argv[])
{

    matrix_t mInput;
    std::vector<int> vInput;
#define INPUT_FILE1 "./foo.txt"
#define INPUT_FILE2 "./example.txt"
#define INPUT_FILE3 "./input.txt"
    parseInputFile(INPUT_FILE3, mInput, vInput);
    matrix_t graph(vInput.size());
    initGraph(graph, mInput, vInput);
    // part One
    cout << shortestPathLenghtPriorityQueue(graph, vInput, 0) << "\n";

#define SCALE_RATIO 5
    matrix_t bigmInput(mInput.size() * SCALE_RATIO, std::vector<int>(mInput.size() * SCALE_RATIO));
    std::vector<int> bigvInput(vInput.size() * SCALE_RATIO * SCALE_RATIO);

    scaleInput(bigmInput, bigvInput, mInput, vInput, SCALE_RATIO);
    matrix_t bigGraph(bigvInput.size());
    initGraph(bigGraph, bigmInput, bigvInput);

    // generateGraphViz(bigGraph, bigvInput, bigmInput.size());
    cout << shortestPathLenghtPriorityQueue(bigGraph, bigvInput, 0) << "\n";

    return 0;
}