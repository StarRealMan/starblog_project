title: 浅尝OpenGL
date: 2020-06-05 02:17:00
categories: 工具
tags: []
toc: true
---
学习了OpenGL的一些基础知识，来分享一下!
[Learn OpenGL][1]
首先，OpenGL到底是什么？
OpenGL是API，没错，但OpenGL更被认为是一种标准，然后每个显卡公司，会针对这种标准，编写自己的一套API函数。
这就带来了一个麻烦，代码的可以执行问题。对于不同的一套显卡设备，API函数不同，让移植变得很困难。因此，在进行OpenGL开发之前，通常使用一种函数映射的库将硬件对应函数对应到一套公用的函数上，只要使用一套公用的函数API，就能够方便地进行移植（也方便了学习）。因此我们先将glad库（正是负责函数映射库）加入到工程中。配合使用的OpenGl库是glfw库，矩阵运算库选择的是glm库，图片操作库选择的是stb_image库，这些库都需要用户先安装。至此，我们的OpenGL开发环境就搭建完成了。

## 坐标变换 ##
OpenGL的最基础元素是顶点元素，三个顶点可以组成一个三角形，构成了最基础的图形，OpenGL的所有图形均是由三角形构成的，这点一定要明确！（即使我想要一个正方形，我也只能通过两个三角形来构建）
![Snipaste_2020-06-10_16-55-32.jpg][2]
首先我们通过某种方式（自己定义在内存中、导入各种格式的模型等）得到一个物体的顶点坐标，这个顶点坐标称为局部空间（Local Space），也就是最初物体的坐标，一般将物体坐标放在中央。我们通过坐标变换，对每个顶点进行变换（Model Matrix），让他出现在应该出现的世界坐标的位置，这个变换包括6个自由度，分别确定了物体在世界坐标下的三维位置与姿态（称之为位姿）。之后，需要将这些点再次变换到以摄像机为中心的坐标系下 （View Matrix），以实现摄像机的自由运动。但是这样直接显示在屏幕上，OpenGL会直接去掉这些点的Z坐标，会有一种不真实的感觉（总而言之就是没有近大远小的感觉），我们再使用投影变换，再将结果同时÷Z坐标，将每个平截头体内点变换到屏幕上，这样我们就得到了一个三维点在二维平面上的坐标了，OpenGL将其画出来就行了。（甚至你可以直接使用小孔模型进行变换）
![Snipaste_2020-06-10_20-03-07.jpg][3]

## 着色器Shader ##
机器是如何把图像画出来的呢？学习OpenGL，其中重要的一点就是学习Shader的编程（GLSL语言）以及它的工作流程（渲染流水线）
下面这张图展示了渲染流水线的工作流程：
![Snipaste_2020-06-10_16-52-24.jpg][4]
上图每一个着色器对应一个shader文件，但是大部分情况下我们只需要顶点着色器（VERTEX SHADER，简称为VS）和片段着色器（FRAGMENT SHADER，简称为FS）即可，顶点着色器用于绘制点，片段着色器用于绘制光栅化后三角形内每一个像素的颜色。
我们在程序里使用API函数编译、链接这些SHADER文件，构成一个SHADER项目，供我们在渲染中使用（SHADER是跑在GPU中的！）。
VS接受程序存在内存中的点的坐标（不只是位置，还可以包括颜色、法向量等其他属性），对其进行坐标变换，将结果送入FS，FS接受VS处理的结果，并在整个三角形中对接收数据进行插值，**相当于接收到的数据不再是三个顶点而是光栅化后的三角形内的许多像素**，再依据程序对这些像素进行运算（需要GPU并行加速），输出每个像素的颜色，进行渲染。

## 光照与纹理 ##
有了上面的基础，在OpenGL中实现光照效果就很简单了（因为我们已经知道如何操作每一个像素的颜色），重中之重在于找到合适的光照模型：
在这里我们使用冯氏光照模型，一个物体的颜色由三个分量加权得到：
![Snipaste_2020-06-10_20-32-35.jpg][5]
ambient：环境光
占有分量最少，描述的是物体在完全黑暗处由于极少量反射呈现的颜色。颜色取决于物体颜色。
diffuse：漫反射
占有分量最多，强度大小由光源向量与面的法向量的内积确定。颜色取决于物体颜色。
![Snipaste_2020-06-10_20-37-22.jpg][6]
specular：镜面反射
占有份量也比较多，强度大小取决于反射后的光线向量与**视角向量**的内积。颜色同时取决于光源颜色与物体颜色。
![Snipaste_2020-06-10_20-37-13.jpg][7]

由于FS中获得的是VS传来值的插值，也就能够获得每个像素点的坐标，因此在FS中进行光照计算能够使得光照更加真实，但是运算量也会更大。

这样一来，每个像素经过渲染流水线就能够产生一个特定的颜色，显示在我们的屏幕上。

最后我们就可以实现一些简单的渲染啦，不要说我技能点点歪了，学习渲染也可以图形化一些问题，也是解题的一大工具呢！






将我的一个入门小项目源码放在这里供大家学习：

    #include <glad/glad.h>
    #include <GLFW/glfw3.h>
    #include <iostream>
    #include <math.h>
    #include "shader.h"
    
    #include <glm/glm.hpp>
    #include <glm/gtc/matrix_transform.hpp>
    #include <glm/gtc/type_ptr.hpp>
    
    #define STB_IMAGE_IMPLEMENTATION
    #include "stb_image.h"
    
    using namespace std;
    
    
    void framebuffer_size_callback(GLFWwindow* window, int width, int height);
    void processInput(GLFWwindow *window);
    void mouse_callback(GLFWwindow* window, double xpos, double ypos);
    void scroll_callback(GLFWwindow* window, double xoffset, double yoffset);
    
    
    // settings
    const unsigned int SCR_WIDTH = 800;
    const unsigned int SCR_HEIGHT = 600;
    
    
    float deltaTime = 0.0f; // 当前帧与上一帧的时间差
    float lastFrame = 0.0f; // 上一帧的时间
    
    float vertices[] = {
        -0.5f, -0.5f, -0.5f,  0.0f, 0.0f,
         0.5f, -0.5f, -0.5f,  1.0f, 0.0f,
         0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
         0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
        -0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
        -0.5f, -0.5f, -0.5f,  0.0f, 0.0f,
    
        -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
         0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
         0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
         0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
        -0.5f,  0.5f,  0.5f,  0.0f, 1.0f,
        -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
    
        -0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
        -0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
        -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
        -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
        -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
        -0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
    
         0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
         0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
         0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
         0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
         0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
         0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
    
        -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
         0.5f, -0.5f, -0.5f,  1.0f, 1.0f,
         0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
         0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
        -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
        -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
    
        -0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
         0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
         0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
         0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
        -0.5f,  0.5f,  0.5f,  0.0f, 0.0f,
        -0.5f,  0.5f, -0.5f,  0.0f, 1.0f
    };
    
    glm::vec3 cubePositions[] = {
      glm::vec3( 0.0f,  0.0f,  0.0f), 
      glm::vec3( 2.0f,  5.0f, -15.0f), 
      glm::vec3(-1.5f, -2.2f, -2.5f),  
      glm::vec3(-3.8f, -2.0f, -12.3f),  
      glm::vec3( 2.4f, -0.4f, -3.5f),  
      glm::vec3(-1.7f,  3.0f, -7.5f),  
      glm::vec3( 1.3f, -2.0f, -2.5f),  
      glm::vec3( 1.5f,  2.0f, -2.5f), 
      glm::vec3( 1.5f,  0.2f, -1.5f), 
      glm::vec3(-1.3f,  1.0f, -1.5f)  
    };
    
    // unsigned int indices[] = {
    //     0, 1, 3,
    //     1, 2, 3
    // };
    
    unsigned int VAO,lightVAO;
    unsigned int VBO, EBO;
    unsigned int texture0;
    int vertexColorLocation;
    int pic_width,pic_height,nrChannels;
    
    //camera
    glm::vec3 cameraPos   = glm::vec3(0.0f, 0.0f,  3.0f);
    glm::vec3 cameraFront = glm::vec3(0.0f, 0.0f, -1.0f);
    glm::vec3 cameraUp    = glm::vec3(0.0f, 1.0f,  0.0f);
    
    glm::mat4 Up_rotate_p = glm::mat4(1.0f);
    glm::mat4 Up_rotate_n = glm::mat4(1.0f);;
    
    float lastX = 400, lastY = 300;
    float yaw,pitch,fov = 45.0f;
    
    int main()
    {
        // glfw: initialize and configure
        // ------------------------------
        glfwInit();
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        //glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
    
        // glfw window creation
        // --------------------
        GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
        if (window == NULL)
        {
            std::cout << "Failed to create GLFW window" << std::endl;
            glfwTerminate();
            return -1;
        }
        glfwMakeContextCurrent(window);
        glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
    
        // glad: load all OpenGL function pointers
        // ---------------------------------------
        if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
        {
            std::cout << "Failed to initialize GLAD" << std::endl;
            return -1;
        }
    
        //mouse
        glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
        glfwSetCursorPosCallback(window, mouse_callback);
        glfwSetScrollCallback(window, scroll_callback);
    
        //texture
        glGenTextures(1, &texture0);
        glBindTexture(GL_TEXTURE_2D, texture0);
        
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);           //x轴扩充方式
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);           //y轴扩充方式
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);       //缩小插值方法
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);       //放大插值方法
        
        stbi_set_flip_vertically_on_load(true);
        unsigned char *data0 = stbi_load("girls.jpg", &pic_width, &pic_height, &nrChannels, 0);
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, pic_width, pic_height, 0, GL_RGB, GL_UNSIGNED_BYTE, data0);
        glGenerateMipmap(GL_TEXTURE_2D);                                        //自动多级渐远
        stbi_image_free(data0);
    
    
    
        //shader compile to program
        //using shader class
        //不能是全局变量，由于构造时未初始化
        Shader main_shader("./shaders/box.vs","./shaders/box.fs");
    
        //vertices
        glGenVertexArrays(1, &VAO);             //generate VAO
        glGenBuffers(1, &VBO);                  //generate VBO
        //glGenBuffers(1, &EBO);                  //generate EBO
    
        glBindVertexArray(VAO);                 //bind VAO
        glBindBuffer(GL_ARRAY_BUFFER, VBO);     //bind VBO
        glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
        
        // glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        // glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    
        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
        glEnableVertexAttribArray(1);
    
        //VBO -> VAO 之后只须绑定VAO即可
        glBindBuffer(GL_ARRAY_BUFFER, 0);       //unbind VBO
        glBindVertexArray(0);                   //unbind VAO
    
        //light
        glGenVertexArrays(1, &lightVAO); 
        glBindVertexArray(lightVAO);
        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
        glEnableVertexAttribArray(0);
    
        // render loop
        // -----------
        while (!glfwWindowShouldClose(window))
        {
            float currentFrame = glfwGetTime();
            deltaTime = currentFrame - lastFrame;
            lastFrame = currentFrame;
            // input
            // -----
            processInput(window);
    
            //预处理
            glm::mat4 model = glm::mat4(1.0f);
            model = glm::rotate(model, (float)glfwGetTime(), glm::vec3(1.0, 0.0, 0.5));
            //清屏 清除Z缓冲
            glClearColor(0.8f, 0.3f, 0.3f, 1.0f);
            glClear(GL_COLOR_BUFFER_BIT);
            glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    
    
            //渲染
            main_shader.use();
            //main_shader.setVec4("ourColor",0.3f,0.1f,0.7f,1.0f);
            main_shader.setInt("texture0", 0);
            
            glEnable(GL_DEPTH_TEST);                    //开启Z缓冲
            glActiveTexture(GL_TEXTURE0);               //在绑定纹理之前先激活纹理单元
            glBindTexture(GL_TEXTURE_2D, texture0);
            glBindVertexArray(VAO);
    
            glm::vec3 front;
            front.x = cos(glm::radians(pitch)) * cos(glm::radians(yaw));
            front.y = sin(glm::radians(pitch));
            front.z = cos(glm::radians(pitch)) * sin(glm::radians(yaw));
            cameraFront = glm::normalize(front);
    
            //trans
    
            glm::mat4 view = glm::mat4(1.0f);;
            view = glm::lookAt(cameraPos, cameraPos + cameraFront, cameraUp);
            main_shader.setMat4("view", view);
            Up_rotate_p = glm::rotate(Up_rotate_p, glm::radians(0.2f*deltaTime),  cameraFront);
            Up_rotate_n = glm::rotate(Up_rotate_n, glm::radians(-0.2f*deltaTime), cameraFront);
    
            glm::mat4 project = glm::mat4(1.0f);
            project = glm::perspective<float>(glm::radians(fov), (SCR_WIDTH/SCR_HEIGHT), 0.1f, 100.0f);
            main_shader.setMat4("project", project);
    
            for (unsigned int i = 0; i < 10; i++)
            {
                // calculate the model matrix for each object and pass it to shader before drawing
                glm::mat4 model = glm::mat4(1.0f);
                model = glm::translate(model, cubePositions[i]);
                float angle = 20.0f * i;
                model = glm::rotate(model, glm::radians(angle+(float)(glfwGetTime()*60)), glm::vec3(1.0f, 0.3f, 0.5f));
                main_shader.setMat4("model", model);
    
                glDrawArrays(GL_TRIANGLES, 0, 36);
            }
    
            glDrawArrays(GL_TRIANGLES, 0, 36);
            glBindVertexArray(0);
            // glfw: swap buffers and poll IO events (keys pressed/released, mouse moved etc.)
            // -------------------------------------------------------------------------------
            glfwSwapBuffers(window);
            glfwPollEvents();
        }
    
        // optional: de-allocate all resources once they've outlived their purpose:
        // ------------------------------------------------------------------------
        glDeleteVertexArrays(1, &VAO);
        glDeleteBuffers(1, &VBO);
        // glfw: terminate, clearing all previously allocated GLFW resources.
        // ------------------------------------------------------------------
        glfwTerminate();
        return 0;
    }
    
    // process all input: query GLFW whether relevant keys are pressed/released this frame and react accordingly
    // ---------------------------------------------------------------------------------------------------------
    void processInput(GLFWwindow *window)
    {
        float cameraSpeed = 3.0f * deltaTime;
    
        if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
            glfwSetWindowShouldClose(window, true);
        if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
            cameraPos += cameraSpeed * cameraFront;
        if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
            cameraPos -= cameraSpeed * cameraFront;
        if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
            cameraPos -= glm::normalize(glm::cross(cameraFront, cameraUp)) * cameraSpeed;
        if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
            cameraPos += glm::normalize(glm::cross(cameraFront, cameraUp)) * cameraSpeed;
        if (glfwGetKey(window, GLFW_KEY_Q) == GLFW_PRESS)
            {
                glm::vec4 cameraUp4 = Up_rotate_p * glm::vec4(cameraUp,1.0f);
                cameraUp = glm::vec3(cameraUp4.x,cameraUp4.y,cameraUp4.z);
            }
            
        if (glfwGetKey(window, GLFW_KEY_E) == GLFW_PRESS)
            {
                glm::vec4 cameraUp4 = Up_rotate_n * glm::vec4(cameraUp,1.0f);
                cameraUp = glm::vec3(cameraUp4.x,cameraUp4.y,cameraUp4.z);
            }
    
    }
    
    // glfw: whenever the window size changed (by OS or user resize) this callback function executes
    // ---------------------------------------------------------------------------------------------
    void framebuffer_size_callback(GLFWwindow* window, int width, int height)
    {
        // make sure the viewport matches the new window dimensions; note that width and 
        // height will be significantly larger than specified on retina displays.
        glViewport(0, 0, width, height);
    }
    
    void mouse_callback(GLFWwindow* window, double xpos, double ypos)
    {
        float xoffset = xpos - lastX;
        float yoffset = lastY - ypos; // 注意这里是相反的，因为y坐标是从底部往顶部依次增大的
        lastX = xpos;
        lastY = ypos;
    
        float sensitivity = 0.05f;
        xoffset *= sensitivity;
        yoffset *= sensitivity;
    
        yaw   += xoffset;
        pitch += yoffset;
    
        if(pitch > 89.0f)
            pitch =  89.0f;
        if(pitch < -89.0f)
            pitch = -89.0f;
    
    }
    
    void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
    {
      if(fov >= 1.0f && fov <= 45.0f)
        fov -= yoffset;
      if(fov <= 1.0f)
        fov = 1.0f;
      if(fov >= 45.0f)
        fov = 45.0f;
    }

使用的Makefile：

    INCLUDE_PATH = ./include
    SOURCE_PATH = ./src
    OBJECT = main.o glad.o
    LIBS = -lglfw3 -lGL -lGLU -ldl -lX11 -lpthread
    
    ++ = g++
    CC = gcc
    
    main:$(OBJECT)
    	$(++) -I$(INCLUDE_PATH) -o main $(OBJECT) $(LIBS)
    
    main.o:main.cpp
    	$(++) -I$(INCLUDE_PATH) -c main.cpp
    
    glad.o:$(SOURCE_PATH)/glad.c
    	$(CC) -I$(INCLUDE_PATH) -c $(SOURCE_PATH)/glad.c
    
    clean:
    	rm *.o
    	rm main


![QQ图片20200914195150.png][8]
![QQ图片20200914195155.png][9]


  [1]: https://learnopengl-cn.github.io/
  [2]: /old_images/2020/06/4288438894.jpg
  [3]: /old_images/2020/06/890806100.jpg
  [4]: /old_images/2020/06/1099674099.jpg
  [5]: /old_images/2020/06/2875422330.jpg
  [6]: /old_images/2020/06/1829637362.jpg
  [7]: /old_images/2020/06/4103478537.jpg
  [8]: /old_images/2020/09/3319805378.png
  [9]: /old_images/2020/09/2082677778.png
