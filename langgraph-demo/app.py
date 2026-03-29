# 配置 API Key
import os

from langchain_core.messages import HumanMessage, SystemMessage

# 基础调用
messages = [
    SystemMessage(content="你是一个专业的助手"),
    HumanMessage(content="请解释什么是人工智能")
]

from langchain_community.chat_models.tongyi import ChatTongyi
from pydantic import BaseModel, Field

# 创建聊天模型
llm = ChatTongyi(
    model="qwen-max",
    model_kwargs={"temperature": 0.7},
    api_key=os.environ["DASHSCOPE_API_KEY"]
)

response = llm.invoke(messages)
print(response.content)


# 结构化输出
class StructuredResponse(BaseModel):
    answer: str = Field(description="答案")
    confidence: float = Field(description="置信度")
    sources: list[str] = Field(description="来源")


# 使用 with_structured_output 自动解析
structured_llm = llm.with_structured_output(StructuredResponse)
result = structured_llm.invoke("机器学习的三大流派是什么？")
print(f"答案：{result.answer}")
print(f"置信度：{result.confidence}")
